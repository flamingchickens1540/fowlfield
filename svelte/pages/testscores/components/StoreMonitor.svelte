<script lang="ts">
    import { get, type Readable, type Writable } from 'svelte/store'
    import type { ChangeEventHandler } from 'svelte/elements'
    import { safeParseInt } from '~common/utils'

    export let label: string
    export let pad: boolean = false
    export let store: Writable<any> | Readable<any>

    export let type: 'checkbox' | 'number' | 'text' = 'text'
    const readonly = !('set' in store)
    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement
        if (!('set' in store)) {
            return
        }
        if (type == 'checkbox') {
            store.set(target.checked)
        } else if (type == 'number') {
            store.set(safeParseInt(target.value) ?? get(store))
        } else {
            store.set(target.value)
        }
    }
</script>

<div class="row" style={pad ? 'margin-top:20px' : ''}>
    <span>{label}</span>
    <div style="width:200px">
        {#if type == 'checkbox'}
            <input {readonly} {type} checked={$store} on:change={onChange} />
        {:else}
            <input {readonly} {type} value={$store} on:change={onChange} />
        {/if}
    </div>
</div>

<style lang="scss">
    .row {
        span {
            font-weight: bold;
        }
        input {
            width: 90%;
            outline-color: rgba(183, 183, 183, 0.3);
            background-color: #404040a0;
            accent-color: rgba(183, 183, 183, 0.63);
            padding: 5px;
            border-radius: 5px;
            &[type='checkbox'] {
                zoom: 1.5;
            }
        }
        padding: 5px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background-color: var(--bgcolor, #4a4a4a);
        border: solid #a0a0a0 1px;
    }
</style>
