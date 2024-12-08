<script lang="ts">
    import { teamList } from '~/lib/store'
    import type { RankingEntry } from '~common/types'

    export let rank:number
    export let ranking:RankingEntry
    const team = $teamList[ranking.team]
    const {rp, win, loss, tie} = ranking.match_stats
</script>

<tr>
    <td>#{rank}</td>
    <td class="bold">{team.display_number.get()}</td>
    <td>{team.team_name.get()}</td>
    <td>{rp}</td>
    <td>{win}-{loss}-{tie}</td>
</tr>

<style lang=scss>
    @import "../rankings";
    .bold {
      font-weight: 700;
    }
    tr:nth-child(1) {
        > * {
            padding-top:30px;
        }
    }
    tr:nth-child(odd) {
        background-color: hsl(34, 0%, 70%);
    }
    tr:nth-child(even) {
        background-color: hsl(34, 0%, 60%);
}
</style>