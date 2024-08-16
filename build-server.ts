import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { build } from 'esbuild'

const __dirname = dirname(fileURLToPath(import.meta.url))

await build({
    entryPoints: ['server/index.ts'],
    outfile: 'build/server.js',
    bundle: true,
    sourcemap: 'both',
    platform: 'node',
    logLevel: 'info',
    packages: 'external',
    format: 'esm',
    tsconfig: 'server/tsconfig.json',

    absWorkingDir: __dirname
})
