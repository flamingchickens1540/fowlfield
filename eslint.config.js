import eslintPluginSvelte from 'eslint-plugin-svelte'
export default [
    // add more generic rule sets here, such as:
    // js.configs.recommended,
    ...eslintPluginSvelte.configs['flat/prettier'],
    {
        rules: {
            // override/add rules settings here, such as:
            // 'svelte/rule-name': 'error'
        }
    }
]
