<script lang="ts">
    import { derived, type Readable, writable } from 'svelte/store'
    import { safeParseInt } from '~common/utils'
    import { type LowZoneKeys } from '~/pages/scoring/Scoring.svelte'
    import matchData from '~/lib/store'

    export let updateFunction: (field: LowZoneKeys, value?: number) => void
    export let isRed: Readable<boolean>
    export let field: LowZoneKeys

    const { scores } = matchData
    const parent = derived([scores, isRed], ([$scores, $isRed]) => $scores[$isRed ? 'red' : 'blue'])
    const store = writable(0)
    let isStart = true
    let timeout = 0
    let id = false
    parent.subscribe((value) => {
        clearTimeout(timeout)
        if (id != $isRed || isStart) {
            isStart = false
            id = $isRed
            store.set(value[field])
        } else {
            timeout = setTimeout(() => {store.set(value[field])}, 1000) as unknown as number
        }
    })
    function update() {
        clearTimeout(timeout)
        // setTimeout(() => clearTimeout(timeout), 500)
        updateFunction(field, safeParseInt($store))
    }
</script>

<div class={`inputrow alliance_${isRed?"red":"blue"} style_${field}`}>
    <button class="btn btnminus" on:click={() => {$store--; update()}}>-</button>
    <input type="number" bind:value={$store} on:change={update}>
    <button class="btn btnplus" on:click={() => {$store++; update()}}>+</button>
    {#if field != "zone_bunnies"}
        <div class="label"><span>{$store}pts</span></div>
    {:else}
        <div class="label"><span>{6 * $store}pts</span></div>
    {/if}
</div>

<style lang="scss">
  .alliance_red.style_zone_balloons_own, .alliance_blue.style_zone_balloons_opp {
    background-color: #d23f3f;

    .label {
      background-color: #a42323;
    }
  }

  .alliance_red.style_zone_balloons_opp, .alliance_blue.style_zone_balloons_own {
    background-color: #305ac5;

    .label {
      background-color: #1e3b7f;
    }
  }

  .style_zone_bunnies {
    margin-top: 20px;
    background-color: #4fcb4f;

    .label {
      background-color: #258a25;
    }
  }

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

  .inputrow {
    flex-grow: 1;
    border: 2px black solid;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem;
    min-width: 0;
    min-height: 0;
  }
</style>