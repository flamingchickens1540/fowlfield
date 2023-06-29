<script lang="ts">
    import matchData, { dsStatuses, teamList,loadedMatches } from "@store";
    import writableDerived from "svelte-writable-derived";
    import type { Writable } from "svelte/store";
    import type { DriverStation } from "@fowltypes";
    
    export let store:Writable<number>
        export let station:DriverStation
        
        export let {id} = matchData
        export let {loaded} = loadedMatches
        
        $: currentMatch = $id == $loaded
        
        let dsColor
        let robotColor
        dsStatuses.subscribe((statuses) => {
            if (statuses == null) {return}
            const status = statuses[station] 
            dsColor = status.dsConnected ? "#005700" : status.bypassed ? "#000000" : "#570000"
            robotColor = status.robotConnected ? "#005700" : status.bypassed ? "#000000" : "#570000"
        })
        
        const prettyteamnum = writableDerived(store, 
        (storevalue) => {
            return $teamList[storevalue]?.displaynum.get()
        }, 
        (value, storevalue) => {
            if (value == "") {return 0}
            const team = Object.values($teamList).find((team) => team.displaynum.get() == value)
            if (team != null) {return team.id}
            
            return storevalue;
        })
    </script>
    
    <div class=row>
        {#if currentMatch}
        <div class=indicator style="--bgcolor:{dsColor}">D</div>
        <div class=indicator style="--bgcolor:{robotColor}">R</div>
        {/if}
        <input bind:value={$prettyteamnum} list=teams/>
    </div>
    
    <style lang=scss>
        $inputcolor: rgb(59,59,59);
        .row {
            display:flex;
            margin:5px;
            justify-content: space-between;
            align-items:center;
            border: solid $inputcolor 1px;
        }
        .indicator {
            display:block;
            width:20px;
            height:26px;
            background-color: var(--bgcolor);
        }
        input {
            /* width:80%; */
            background-color:$inputcolor;
            border:0px;
            height:20px;
            padding:3px 5px;
            width:60px;
        }
    </style>