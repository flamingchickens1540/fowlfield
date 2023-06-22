import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {context} from "esbuild"

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
    await ctx.watch()
    console.log("watching")
} else {
    await ctx.rebuild()
    await ctx.dispose()
}