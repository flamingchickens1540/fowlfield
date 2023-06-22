import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import fs from "fs"
import path from "node:path"
import proxy from "http-proxy-middleware"
import express from "express"



let entryFiles = [
    'test',
    'bogus', // TODO: remove bogus once another page is ready
]
let entryPoints = entryFiles.map((file) => path.join("svelte", file, "index.ts"))
console.log(entryPoints)
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
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script type="module" src="/assets/${req.params.page}/index.js"></script>
            <link rel="stylesheet" href="/assets/${req.params.page}/index.css"></link>
            <link rel="stylesheet" href="/assets/app.css"></link>
            <title>${req.params.page.toUpperCase()}</title>
            ${mode == "dev" ? "<script>new EventSource('/esbuild').addEventListener('change', () => location.reload())</script>":""}
        </head>
        <body>
        </body>
        </html>
    `)
    })

    
    
    server.listen(3001)
}