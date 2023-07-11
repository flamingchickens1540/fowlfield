import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {context} from "esbuild"
import {spawn} from "child_process"
const __dirname = dirname(fileURLToPath(import.meta.url));


const ctx = await context({
    entryPoints: ["src/index.ts"],
    outfile: "index.cjs",
    bundle: true,
    platform:"node",
    logLevel: "info",
    absWorkingDir: __dirname,
    alias: {
        "@fowlutils":"../common/utils",
        "@fowltypes":"../common/types"
    }
})


const mode = process.argv[2]

if (mode == "watch") {
    let childProccess = spawn("./node_modules/.bin/nodemon", ["index.cjs"], {
        stdio:"inherit",
        cwd:__dirname,
        shell:true
    })
    await ctx.watch()
    console.log("watching")
    
} else {
    await ctx.rebuild()
    await ctx.dispose()
}