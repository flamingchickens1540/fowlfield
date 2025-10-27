<script lang="ts">
    import type { ToteKey } from '~common/types'
    import { derived, type Writable } from 'svelte/store'
    import { matchData } from '~/lib/store'

    const { scores } = matchData
    export let parentStore: Writable<string>
    export let key: ToteKey
    export let label: string
    const tote = derived(scores, ($scores) => $scores.totes[key])
    $: isPartial = $tote?.bunnies > 0
    $: isDone = $tote.red_balloons > 0 || $tote.blue_balloons > 0
    $: isActive = $parentStore == key
</script>

<button class={`${isActive ? 'active' : ''}  ${isDone ? 'done' : ''} ${isPartial ? 'partial' : ''}`} on:click={() => ($parentStore = key)}>{label}</button>

<style lang="scss">
    button {
        font-weight: 300;
        outline: none;
        background-color: #383838;
        color: white;

        border: 2px solid #595959;
        &.partial {
            color: #ffff00;
        }

        &.done {
            background-color: #098000;
        }
        &.active {
            font-weight: 900;
            background-color: #9904aa;
            box-shadow: inset 0 0 10px 1px #363636;
        }
        padding: 10px 24px; /* Some padding */
        cursor: pointer; /* Pointer/hand icon */
        float: left; /* Float the buttons side by side */
        border-radius: 0;
        flex-grow: 1;
        font-size: 1.5em;
        &:nth-child(2) {
            border-radius: 5px 0 0 5px;
        }
        &:nth-last-child(2) {
            border-radius: 0 5px 5px 0;
        }
    }
</style>
