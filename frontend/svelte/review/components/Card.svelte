<script lang="ts">
    import {Card} from "@fowltypes";
    import matchData, {teamList} from "@store";
    import writableDerived from "svelte-writable-derived";
    import {derived, type Writable} from "svelte/store";

    export let isRedAlliance: boolean;
    export let stationid: 1 | 2 | 3;

    const pos = (isRedAlliance ? "red" : "blue") + stationid;
    const robotNum: Writable<number> = matchData[pos];
    const robot = derived([teamList, robotNum], ([$teams, $robotNum]) => $teams[$robotNum]?.displaynum?.get() ?? $robotNum);
    const cardStore = isRedAlliance ? matchData.redCards : matchData.blueCards;
    const card: Writable<Card> = writableDerived(
        cardStore,
        (store) => store?.[stationid - 1] ?? Card.NONE,
        (newcard, old) => {
            old[stationid - 1] = newcard;
            return old;
        },
        Card.NONE
    );

    const didTaxi = writableDerived(
        isRedAlliance ? matchData.redScoreBreakdown : matchData.blueScoreBreakdown,
        ($breakdown) => $breakdown.autoTaxiBonus[stationid - 1],
        (newVal, $breakdown) => {
            $breakdown.autoTaxiBonus[stationid - 1] = newVal;
            return $breakdown;
        }
    );
    const didPark = writableDerived(
        isRedAlliance ? matchData.redScoreBreakdown : matchData.blueScoreBreakdown,
        ($breakdown) => $breakdown.endgameParkBonus[stationid - 1],
        (newVal, $breakdown) => {
            $breakdown.endgameParkBonus[stationid - 1] = newVal;
            return $breakdown;
        }
    );
</script>

<div class="container">
    <div class="robotnumber">{$robot}</div>
    <select class="cardselector" bind:value={$card}
            style="background-color:{$card == Card.RED ? '#800000' : $card == Card.YELLOW ? '#6c6c00' : '#383838'}">
        <option value={Card.RED}>Red Card</option>
        <option value={Card.YELLOW}>Yellow Card</option>
        <option value={Card.NONE}>None</option>
    </select>
    <button on:click={() => ($didTaxi = !$didTaxi)} style="background-color:{$didTaxi ? '#7e727e' : '#1a1a1a'}">Taxi
    </button>
    <button on:click={() => ($didPark = !$didPark)} style="background-color:{$didPark ? '#727e72' : '#1a1a1a'}">Park
    </button>
</div>

<style lang="scss">
  .container {
    .robotnumber {
      font-size: 20px;
      min-width: 50px;
    }

    .cardselector {
      padding: 5px;
      margin: 5px;
      font-size: 20px;
      min-width: 100px;
    }

    button {
      min-width: 100px;
      font-size: 20px;
    }

    gap: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
