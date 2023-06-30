<script lang="ts">
	import type { WritableTeamData } from "socketStore";

    export let rank:number
    export let teamData:WritableTeamData

    const {displaynum,name, matchStats} = teamData
</script>

<tr>
    <td>#{rank}</td>
    <td>{$displaynum}</td>
    <td>{$name}</td>
    <td>{$matchStats.rp}</td>
    <td>{$matchStats.win}-{$matchStats.loss}-{$matchStats.tie}</td>
</tr>

<style lang=scss>
    @import "../rankings.scss";
    tr:nth-child(1) {
        > * {
            padding-top:30px;
        }
    }
    tr:nth-child(odd) {
        background-color: hsl(34, 57%, 70%);
    }
    tr:nth-child(even) {
        background-color: hsl(34, 57%, 60%);
}
</style>