// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

let pages = ['audience', 'alliance', 'match', 'event', 'queuing', 'rankings', 'test', 'scoring', 'review', 'announcer']

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
