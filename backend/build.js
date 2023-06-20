import {buildSync} from "esbuild"

buildSync({
    entryPoints: ["src/index.ts"],
    outfile: "index.cjs",
    bundle: true,
    platform:"node"
})