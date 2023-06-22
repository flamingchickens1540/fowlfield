import {context} from "esbuild"

const ctx = await context({
    entryPoints: ["src/index.ts"],
    outfile: "index.cjs",
    bundle: true,
    platform:"node",
    logLevel: "info"
})


const mode = process.argv[2]

if (mode == "watch") {
    await ctx.watch()
    console.log("watching")
} else {
    await ctx.rebuild()
    await ctx.dispose()
}