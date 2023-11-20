<script lang=ts>
	import { teamList } from "@store";
	import {alliances} from "alliance/AllianceDisplay.svelte";
	import { derived } from "svelte/store";

    export let index: 0|1|2|3
    const alliance = derived(alliances, ($alliances) => $alliances[index])

    function setTeamAlliance(pos:number, team:string) {
        const oldteam = $teamList[$alliance[pos-1]]
        oldteam?.alliancePosition.set(0);
        oldteam?.alliance.set(0);
        if (team == "" || team == "0") {
            return
        }
        teamList.update((list) => {
            const teamstore = Object.values(list).find((t) => t.displaynum.get() == team)
            if (teamstore == null) {return list}
            teamstore.alliancePosition.set(pos as 0|1|2|3|4);
            teamstore.alliance.set(index+1 as 1|2|3|4);
            return list
        })
    }
</script>

<div class=container>
    <div>Alliance {index+1}</div>
    <input value={$teamList[$alliance[0]]?.displaynum?.get() ?? ""} on:input={(e) => {setTeamAlliance(1, e.target["value"])}} list=teams/>
    <input value={$teamList[$alliance[1]]?.displaynum?.get() ?? ""} on:input={(e) => {setTeamAlliance(2, e.target["value"])}} list=teams/>
    <input value={$teamList[$alliance[2]]?.displaynum?.get() ?? ""} on:input={(e) => {setTeamAlliance(3, e.target["value"])}} list=teams/>
    <input value={$teamList[$alliance[3]]?.displaynum?.get() ?? ""} on:input={(e) => {setTeamAlliance(4, e.target["value"])}} list=teams/>
</div>



<style>
    .container {
        display:contents;
    }
    * {
        font-size:20px;
    }
    input {
        height:30px;
    }
</style>