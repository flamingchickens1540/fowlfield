<script lang="ts">
    import matchData, { teamList } from '~/lib/store'
    import { derived } from 'svelte/store'
    import type { RobotPosition } from '~common/types'
    import { createSecondOrderPropertyStore } from '~/lib/socketStore'

    export let isRedAlliance: boolean;
    export let stationid: 1 | 2 | 3;

    const station = (isRedAlliance?'red':'blue')+stationid as RobotPosition;
    const robot = derived([matchData[station], teamList], ([robot, teamList]) => teamList[robot]?.display_number.get() ?? "-");
    const card = createSecondOrderPropertyStore(matchData.scores, isRedAlliance?'red':'blue', `card_robot${stationid}`);
</script>

<div class="container">
    <div class="robotnumber">{$robot}</div>
    <select class="cardselector" bind:value={$card}
            style="background-color:{$card == 'red' ? '#800000' : $card == 'yellow' ? '#6c6c00' : '#383838'}">
        <option value={"red"}>Red Card</option>
        <option value={"yellow"}>Yellow Card</option>
        <option value={"none"}>None</option>
    </select>
</div>

<style lang="scss">
  .container {
    .robotnumber {
      font-size: 30px;
      min-width: 50px;
      font-weight:900;
    }

    .cardselector {
      padding: 5px;
      margin: 5px;
      font-size: 20px;
      width: 130px;
    }
    min-height: 0;
    > * {
      min-height: 0;
    }
    gap: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
