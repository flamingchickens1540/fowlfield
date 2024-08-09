// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

let pages = ['estop', 'alliance', 'match']

// //// Loads all subdirectories of /svelte
// fs.readdirSync("svelte/pages").forEach(function (filepath) {
//     let file = fs.statSync('svelte/pages'+filepath)
//     if (file.isDirectory()) {
//     entryPoints.push("svelte/"+path.basename(filepath)+"/index.ts")
//     }
// })

let entrypoints: Record<string, string> = {}
for (const key of pages) {
    entrypoints[key] = resolve(__dirname, `svelte/pages/${key}/index.html`)
}

export default defineConfig({
    plugins: [svelte({ configFile: resolve(__dirname, 'svelte.config.js') })],
    resolve: {
        alias: {
            '~': resolve(__dirname, './svelte'),
            '~common': resolve(__dirname, './common')
        }
    },
    root: resolve(__dirname, './svelte/pages'),
    publicDir: resolve(__dirname, './public'),
    build: {
        emptyOutDir: true,
        outDir: resolve(__dirname, './dist'),
        rollupOptions: {
            input: entrypoints
        }
    }
})
