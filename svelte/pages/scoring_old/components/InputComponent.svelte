<script lang="ts">
    import type { Tote } from '@prisma/client'
    import { writable, type Writable } from 'svelte/store'
    import { safeParseInt } from '~common/utils'

    export let updateFunction: (field: keyof Tote, value?: number) => void
    export let tote: Writable<Tote>
    export let field: keyof Tote

    const store = writable(0)
    tote.subscribe((value) => {
        store.set(value[field])
    })
</script>

<div class={`inputrow style_${field}`}>
    <button class="btn btnminus" on:click={() => updateFunction(field, $store - 1)}>-</button>
    <input type="number" bind:value={$store} on:change={(e) => updateFunction(field, safeParseInt(e.currentTarget.value))} />
    <button class="btn btnplus" on:click={() => updateFunction(field, $store + 1)}>+</button>
</div>

<style lang="scss">
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
    }
    .btnplus {
        background-color: #003d00;
    }
    .btnminus {
        background-color: #590000;
    }
    .style_red_balloons {
        background-color: #d23f3f;
    }
    .style_blue_balloons {
        background-color: #305ac5;
    }
    .style_bunnies {
        background-color: #4fcb4f;
    }
    .inputrow {
        border: 2px black solid;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.5rem;
        min-width: 0;
    }
</style>
