<script lang="ts">
    import type { Readable } from 'svelte/store'
    import type { ScoreBreakdown } from '~common/types'

    export let key: string
    export let store: Readable<ScoreBreakdown>
    // autoBunnyCount:number,
    // finalBunnyCount:number,
    // autoTaxiBonus: [boolean, boolean, boolean]
    // targetHits: [number, number, number], // These are times this alliance hit an opponent robot
    // fouls: Foul[] // These are fouls committed by the other alliance, they represent points to be added to this alliance
    // endgameParkBonus: [boolean, boolean, boolean]
    const writableValues = ['autoBunnyCount', 'finalBunnyCount']
</script>

<div class="parent">
    <em>{key}</em>
    {#each Object.entries($store) as entry}
        <div class="child">
            <em>{entry[0]}</em>
            {#if writableValues.includes(entry[0])}
                <input bind:value={$store[entry[0]]} />
            {:else}
                <input value={$store[entry[0]]} />
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .parent {
        border: 1px solid rgb(115, 115, 115);
        padding-left: 3px;
        padding-right: 3px;
        padding-bottom: 3px;

        &:not(:first-child) {
            border-top-width: 0;
        }

        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
    }

    .child {
        border: 1px solid rgb(115, 115, 115);
        padding-left: 3px;

        &:not(:nth-child(2)) {
            border-top-width: 0;
        }

        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
</style>
