import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// svelte.config.js
export default {
    // svelte options
    extensions: ['.svelte'],
    compilerOptions: {},
    preprocess: [vitePreprocess()],
    onwarn: (warning, handler) => {
        if (warning.code.startsWith('a11y-')) return
        handler(warning)
    },
    // plugin options
    vitePlugin: {
        exclude: [],
        // experimental options
        experimental: {}
    }
}
