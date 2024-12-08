<script lang="ts">
    import type { ToteKey } from '~common/types'
    import { derived, type Writable } from 'svelte/store'
    import { matchData } from '~/lib/store'

    const {scores} = matchData
    export let parentStore:Writable<ToteKey>
    export let key:ToteKey
    export let label:string;
    const tote = derived(scores, ($scores) => $scores.totes[key])
    $: isPartial = $tote?.bunnies > 0
    $: isDone = $tote.red_balloons > 0 || $tote.blue_balloons > 0
    $: isActive = $parentStore == key
</script>

<button class={isActive ? "active" : isDone ? "done" :  isPartial ? "partial" : "blank"} on:click={() => $parentStore = key}>{label}</button>

<style lang="scss">
  button {
    font-weight: 300;
    outline:none;
    &.active {
      font-weight: 900;
        background-color: #9904aa;
        border: 1px solid white;

        color: white;
    }
    &.blank {
      background-color: #383838;
      border: 1px solid #181818;
      color: white;
    }
    &.partial {
      background-color: #6c5300;
      border: 1px solid #6c4600;
      color: white;
    }
    &.done {
      background-color: #098000;
      border: 1px solid #104d00;
      color: white;
    }
    background-color: #04AA6D; /* Green background */
    border: 1px solid green; /* Green border */
    color: white; /* White text */
    padding: 10px 24px; /* Some padding */
    cursor: pointer; /* Pointer/hand icon */
    float: left; /* Float the buttons side by side */
    border-radius: 0;
    flex-grow:1;
    font-size: 2em;
    &:first-child {
      border-radius: 5px 0 0 5px;
    }
    &:last-child {
      border-radius: 0 5px 5px 0;
    }
  }
</style>