<script lang="ts">
    import { derived, type Writable } from 'svelte/store'
    import { matchData } from '~/lib/store'

    const { scores } = matchData
    export let parentStore: Writable<string>
    export let isRed: boolean
    const key = isRed ? 'red' : 'blue'
    const store = derived(scores, ($scores) => $scores[key])
    $: hasBunnies = $store?.zone_bunnies > 0
    $: hasBallons = $store.zone_balloons_own > 0 || $store.zone_balloons_opp > 0
    $: isActive = $parentStore == key
</script>

<button class={`${key} ${isActive ? "active" : ""}  ${hasBallons ? "done" : ""} ${hasBunnies ? "partial" : ""}`}
        on:click={() => $parentStore = key}>{isRed ? "Red Zone" : "Blue Zone"}</button>

<style lang="scss">
  button {
    outline: none;
    background-color: #383838;
    font-weight: 500;
    border: 1px solid #595959;
    &.red {
      color: #ff9191;
    }

    &.blue {
      color: #9fc3ff;
    }



    &.done {
      background-color: #098000;
    }
    &.active {
      font-weight: 900;
      background-color: #9904aa;
      box-shadow: inset 0 0 10px 1px #003b00;
    }

    padding: 10px 24px; /* Some padding */
    cursor: pointer; /* Pointer/hand icon */
    float: left; /* Float the buttons side by side */
    border-radius: 5px;
    margin-right: 5px;
    margin-left: 5px;
    flex-grow: 2;
    font-size: 1.5em;

  }
</style>