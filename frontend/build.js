import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import fs from "fs"
import path from "node:path"
import proxy from "http-proxy-middleware"
import express from "express"



let pages = {
    'test':     ["Stores Test",false],
    'match':    ["Match Control",false],
    'audience': ["Audience Display",false],
    "event":    ["Team Management",false],
    "monitor":  ["Field Monitor",true],
    "estop":    ["Estop Panel",true]
}
let entryPoints = Object.keys(pages).map((file) => path.join("svelte", file, "index.ts"))
//// Loads all subdirectories of /svelte
// fs.readdirSync("svelte/").forEach(function (filepath) {
//     let file = fs.statSync('svelte/'+filepath)
//     if (file.isDirectory()) {
//     entryPoints.push("svelte/"+path.basename(filepath)+"/index.ts")
//     }
// })


const mode = process.argv[2] ?? "build"

let ctx = await esbuild.context({
    entryPoints,
    mainFields: ["svelte", "browser", "module", "main"],
    bundle: true,
    outdir: "./dist",
    minify:true,
    sourcemap:"inline",
    plugins: [
        esbuildSvelte({
            preprocess: sveltePreprocess({sourceMap:true}),
        }),
    ],
    logLevel:"error"

})

await ctx.rebuild()
if (mode == "serve" || mode == "dev" || mode =="watch") {
    const server = express()

    server.use("/", express.static("public"))
    if (mode == "dev" || mode=="watch") {await ctx.watch()}
    if (mode == "dev") {
        
        let { host, port } = await ctx.serve({
            servedir:"dist"
        })
        
        console.log(host, port)
        let myProxy = proxy.createProxyMiddleware({target:"http://localhost:"+port, pathRewrite: (path, req) => path.replace("/assets","")})

        server.use("/assets", myProxy)
        
        server.use("/esbuild", myProxy)
    } else {
        server.use("/assets", express.static("dist"))
    }
    server.get("/", (req, res) => {
        res.redirect("/test")
    })
    server.get("/:page", (req, res) => {
        const page = req.params.page.replace(/\/+$/, "");
        if (!(page in pages)) {res.status(404).send("Page not found");return;}
        const title = pages[page][0] ?? "FowlField"
        const showManifest = pages[page][1] ?? false
        console.log(page, title, showManifest)
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script type="module" src="/assets/${page}/index.js"></script>
            <link rel="stylesheet" href="/assets/${page}/index.css"></link>
            
            <link rel="stylesheet" href="/assets/app.css"></link>
            ${showManifest ? `
            <meta name="apple-mobile-web-app-capable" content="yes">
            <link rel="manifest" href="/${page}.webmanifest" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
            <script>document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });</script>
            `:''}

            <title>${title}</title>
            ${mode == "dev" ? "<script>new EventSource('/esbuild').addEventListener('change', () => location.reload())</script>":""}
        </head>
        <body>
        </body>
        </html>
    `)
    })

    
    
    server.listen(3001)
} else {
    await ctx.dispose()
}