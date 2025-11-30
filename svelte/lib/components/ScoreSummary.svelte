<script lang="ts">
    import matchData from '~/lib/store'
    import { calculatePointsBreakdown } from '~common/utils/scores'
    import { derived } from 'svelte/store'

    const breakdown = derived(matchData.scores, (breakdown) => calculatePointsBreakdown(breakdown))
    const { redScore, blueScore } = matchData
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
            <th>Auto Carrots</th>
            <td>{$breakdown.red.auto_carrots}</td>
            <td>{$breakdown.blue.auto_carrots}</td>
        </tr>
        <tr>
            <th>Auto Park</th>
            <td>{$breakdown.red.auto_park}</td>
            <td>{$breakdown.blue.auto_park}</td>
        </tr>
        <tr>
            <th>Bunnies</th>
            <td>{$breakdown.red.tele_bunnies}</td>
            <td>{$breakdown.blue.tele_bunnies}</td>
        </tr>
        <tr>
            <th>Carrots</th>
            <td>{$breakdown.red.tele_carrots}</td>
            <td>{$breakdown.blue.tele_carrots}</td>
        </tr>
        <tr>
            <th>Hits</th>
            <td>{$breakdown.red.tele_hits}</td>
            <td>{$breakdown.blue.tele_hits}</td>
        </tr>
        <tr>
            <th>Foul</th>
            <td>{$breakdown.red.foul}</td>
            <td>{$breakdown.blue.foul}</td>
        </tr>
        <tr>
            <th>Coopertition</th>
            <td>{$breakdown.red.coopertition}</td>
            <td>{$breakdown.blue.coopertition}</td>
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
        > *:nth-child(2) {
            background-color: hsl(358, 55%, 35%);
        }
        > *:nth-child(3) {
            background-color: hsl(206, 55%, 35%);
        }
        > *:nth-child(1) {
            background-color: hsl(206, 0%, 35%);
        }
        tbody > &:nth-last-child(1) {
            font-weight: 900;
        }
        &:nth-child(odd) {
            filter: brightness(0.85);
        }
        thead > &:nth-child(1) {
            filter: brightness(0.75);
        }
    }
    td,
    th {
        padding: 7px 30px;
        font-size: 20px;
    }
</style>
