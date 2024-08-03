<script lang="ts">
    import {getBlankScoreBreakdown} from "utils/blanks";
    import matchData from "~/lib/store"
    import {calculatePointBreakdown} from "utils/scores";
    import {derived} from "svelte/store";


    const defaultData = getBlankScoreBreakdown()
    const redBreakdown = derived(matchData.redScoreBreakdown, (breakdown) => calculatePointBreakdown(breakdown))
    const blueBreakdown = derived(matchData.blueScoreBreakdown, (breakdown) => calculatePointBreakdown(breakdown))
    const {redScore, blueScore} = matchData
</script>

<table>
    <thead>
    <tr>
        <th>Type</th>
        <th>Red</th>
        <th>Blue</th>
    </tr>
    </thead>
    <tbody>
    <tr></tr>
    <tr>
        <th>Hybrid Bunny</th>
        <td>{$redBreakdown.autoBunny}</td>
        <td>{$blueBreakdown.autoBunny}</td>
    </tr>
    <tr>
        <th>Hybrid Taxi</th>
        <td>{$redBreakdown.autoTaxi}</td>
        <td>{$blueBreakdown.autoTaxi}</td>
    </tr>
    <tr>
        <th>Hits</th>
        <td>{$redBreakdown.targetHits}</td>
        <td>{$blueBreakdown.targetHits}</td>
    </tr>
    <tr>
        <th>Final Bunnies</th>
        <td>{$redBreakdown.finalBunny}</td>
        <td>{$blueBreakdown.finalBunny}</td>
    </tr>
    <tr>
        <th>Park</th>
        <td>{$redBreakdown.endgamePark}</td>
        <td>{$blueBreakdown.endgamePark}</td>
    </tr>
    <tr>
        <th>Total</th>
        <td>{$redScore}</td>
        <td>{$blueScore}</td>
    </tr>
    </tbody>
</table>


<style lang="scss">
  table {
    border-collapse: collapse;
  }
  tr {
    > *:nth-child(2){
      background-color: hsl(358, 55%, 35%)
    }
    > *:nth-child(3){
      background-color: hsl(206, 55%, 35%)
    }
    > *:nth-child(1){
      background-color: hsl(206, 0%, 35%)
    }
    tbody > &:nth-last-child(1) {
      font-weight:900;
    }
    &:nth-child(odd) {
      filter:brightness(0.85)
    }
    thead > &:nth-child(1) {
      filter:brightness(0.75)
    }
  }
  td, th {
    padding: 7px 30px;
    font-size:20px;
  }
</style>