<script lang="ts">
    import type { Tote } from '@prisma/client'
    import { type Readable, writable } from 'svelte/store'
    import { safeParseInt } from '~common/utils'

    export let updateFunction: (field: keyof Tote, value?: number) => void
    export let tote: Readable<Tote>
    export let field: keyof Tote
    export let index: Readable<string>
    const store = writable(0)
    let timeout = 0
    let isStart = true
    let id = ''
    tote.subscribe((value) => {
        clearTimeout(timeout)
        if (id != $index || isStart) {
            isStart = false
            id = $index
            store.set(value[field])
        } else {
            timeout = setTimeout(() => {
                store.set(value[field])
            }, 1000) as unknown as number
        }
    })
    function update() {
        clearTimeout(timeout)
        // setTimeout(() => clearTimeout(timeout), 500)
        updateFunction(field, safeParseInt($store))
    }
</script>

<div class={`inputrow style_${field}`}>
    <button
        class="btn btnminus"
        on:click={() => {
            $store--
            update()
        }}>-</button
    >
    <input type="number" bind:value={$store} on:change={update} />
    <button
        class="btn btnplus"
        on:click={() => {
            $store++
            update()
        }}>+</button
    >
    {#if field != 'bunnies'}
        <div class="label"><span>{3 * $store * 2 ** $tote.bunnies}pts</span></div>
    {:else}
        <div class="label"><span>x{2 ** $store}</span></div>
    {/if}
</div>

<style lang="scss">
    .label {
        font-size: 2rem;
        text-align: center;
        flex-grow: 0;
        height: 100%;
        min-width: 11rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
    }
    input {
        font-size: 2rem;
        text-align: center;
        max-width: 40%;
        border: none;
        outline-color: #ffc400;
        border-radius: 10px;
    }

    .btn {
        flex-grow: 1;
        height: 100%;
        margin-top: 0;
        font-size: 2rem;
    }

    .btnplus {
        background-color: #003d00;
    }

    .btnminus {
        background-color: #590000;
    }

    .style_red_balloons {
        background-color: #d23f3f;
        .label {
            background-color: #a42323;
        }
    }

    .style_blue_balloons {
        background-color: #305ac5;
        .label {
            background-color: #1e3b7f;
        }
    }

    .style_bunnies {
        margin-top: 20px;
        background-color: #4fcb4f;
        .label {
            background-color: #258a25;
        }
    }

    .inputrow {
        flex-grow: 1;
        border: 2px black solid;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.5rem;
        min-width: 0;
    }
</style>
