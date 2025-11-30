<script lang="ts">
    import { derived, writable } from 'svelte/store'
    import { type WritableGettableStore } from '~/lib/socketStore'
    import { safeParseInt } from '~common/utils'

    export let store: WritableGettableStore<number>

    const derivedStore = writable<number>(0)

    let timeout: NodeJS.Timeout | undefined = undefined
    store.subscribe((v) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            derivedStore.set(v)
        }, 1000)
    })

    function update() {
        store.set(safeParseInt($derivedStore))
        clearTimeout(timeout)
    }
</script>

<div class="container">
    <button
        class="red-button btn"
        on:click={() => {
            $derivedStore = Math.max($derivedStore - 1, 0)
            update()
        }}
        ><span>-</span>
    </button>
    <input type="number" bind:value={$derivedStore} on:change={update} />
    <button
        class="green-button btn"
        on:click={() => {
            $derivedStore++
            update()
        }}
        ><span>+</span>
    </button>
</div>

<style lang="scss">
    .red-button {
        background-color: rgb(143, 0, 0);
    }

    .green-button {
        background-color: green;
    }

    .container {
        flex-direction: row;
        display: flex;
        justify-content: center;
        align-items: stretch;
        //width:80%;
    }

    .container > * {
        font-size: 40px;
    }

    .container input {
        max-width: 150px;
        flex: 1;
        text-align: center;
        border-radius: 0;
        border: none;
        box-sizing: border-box;
    }

    .btn {
        flex: 1;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin: 0;
        span {
            margin: 0;
            padding: 0;
        }
        &:first-child {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
</style>
