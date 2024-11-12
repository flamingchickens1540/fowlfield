<script lang="ts">
    import matchData from '~/lib/store'
    import { calculatePointsBreakdown } from '~common/utils/scores'
    import { derived } from 'svelte/store'

    const breakdown = derived(matchData.scores, (breakdown) => calculatePointsBreakdown(breakdown))
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
        <th>Low-Zone Bunny</th>
        <td>{$breakdown.red.low_zone_bunny}</td>
        <td>{$breakdown.blue.low_zone_bunny}</td>
    </tr>
    <tr>
        <th>Low-Zone Balloon</th>
        <td>{$breakdown.red.low_zone_balloon}</td>
        <td>{$breakdown.blue.low_zone_balloon}</td>
    </tr>
    <tr>
        <th>Tote Balloons</th>
        <td>{$breakdown.red.tote_balloons}</td>
        <td>{$breakdown.blue.tote_balloons}</td>
    </tr>
    <tr>
        <th>Fouls</th>
        <td>{$breakdown.red.foul}</td>
        <td>{$breakdown.blue.foul}</td>
    </tr>
    <tr>
        <th>Coopertition</th>
        <td>{$breakdown.red.empty_corral}</td>
        <td>{$breakdown.blue.empty_corral}</td>
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