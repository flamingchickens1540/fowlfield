import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import fs from "fs"
import path from "node:path"
import proxy from "http-proxy-middleware"
import express from "express"



let pages = {
    'test':"Stores Test",
    'bogus':"Bogus Page", // TODO: remove bogus once another page is ready
}
let entryPoints = Object.keys(pages).map((file) => path.join("svelte", file, "index.ts"))
console.log("ABVF",entryPoints)
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
    sourcemap:"inline",
    plugins: [
        esbuildSvelte({
            preprocess: sveltePreprocess({sourceMap:true}),
        }),
    ],
    alias: {
        "@fowlutils":"../common/utils",
        "@fowltypes":"../common/types",
    }
})

await ctx.rebuild()
if (mode == "serve" || mode == "dev") {
    const server = express()

    server.use("/", express.static("public"))

    if (mode == "dev") {
        await ctx.watch()
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
        console.log(page, req.params.page)
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script type="module" src="/assets/${page}/index.js"></script>
            <link rel="stylesheet" href="/assets/${page}/index.css"></link>
            <link rel="stylesheet" href="/assets/app.css"></link>
            <title>${pages[page] ?? "FowlField"}</title>
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