import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { context } from 'esbuild'
import { spawn } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))

const ctx = await context({
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

const mode = process.argv[2]

if (mode == 'watch') {
    let childProccess = spawn('./node_modules/.bin/nodemon', ['index.cjs'], {
        stdio: 'inherit',
        cwd: __dirname,
        shell: true
    })
    await ctx.watch()
    console.log('watching')
} else {
    await ctx.rebuild()
    await ctx.dispose()
}
