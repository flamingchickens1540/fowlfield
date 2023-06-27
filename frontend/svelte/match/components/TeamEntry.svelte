<script lang="ts">
	import { dsStatuses, teamList } from "@store";
	import writableDerived from "svelte-writable-derived";
	import type { Writable } from "svelte/store";
	import type { DriverStation } from "@fowltypes";
    
    export let store:Writable<number>
    export let station:DriverStation

    let dsColor
    let robotColor
    dsStatuses.subscribe((statuses) => {
       const status = statuses[station] 
       console.log(station, status)
        dsColor = status.dsConnected ? "#005700" : status.bypassed ? "#515700" : "#570000"
        robotColor = status.robotConnected ? "#005700" : status.bypassed ? "#515700" : "#570000"
    })
    
    const prettyteamnum = writableDerived(store, 
		(storevalue) => {
			return $teamList[storevalue]?.displaynum.get()
		}, 
		(value, storevalue) => {
			console.log(value)
			if (value == "") {return null}
			const team = Object.values($teamList).find((team) => team.displaynum.get() == value)
			if (team != null) {return team.id}

			return storevalue;
		})
</script>

<div class=row>
<div class=indicator style="--bgcolor:{dsColor}">D</div>
<div class=indicator style="--bgcolor:{robotColor}">R</div>
<input bind:value={$prettyteamnum} list=teams/>
</div>

<style>
    .row {
        display:flex;
        margin:5px;
        justify-content: space-between;
        align-items:center;
    }
    .indicator {
        display:block;
        width:20px;
        height:26px;
        background-color: var(--bgcolor);
    }
    input {
        /* width:80%; */
        border:0px;
        height:20px;
        padding:3px 5px;
        width:50px;
    }
</style>