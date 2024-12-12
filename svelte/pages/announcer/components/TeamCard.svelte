<script lang="ts">
    import matchData, { teamList } from '~/lib/store'

    export let team_num: number;
    export let alliance: 'red' | 'blue'
    
    const { type } = matchData
    
    let selectionMap:{[key:number]:string} = {
        0: "",
        1: "Captain",
        2: "First Pick",
        3: "Second Pick",
        4: "Third Pick"   
    }
</script>

<script context=module lang=ts>
    import { derived } from 'svelte/store'
    import { alliances, rankings } from '~/lib/store'

    const rankingsmap = derived(rankings, (rankings) => {
        let map:Record<number, number> = {}
        for (let i = 0; i < rankings.length; i++) {
            map[rankings[i].team] = i+1
        }
        return map
    })

    function getOrdinal(n:number) {
        let ord = 'th';
        
        if (n % 10 == 1 && n % 100 != 11) {ord = 'st';}
        else if (n % 10 == 2 && n % 100 != 12){ord = 'nd';}
        else if (n % 10 == 3 && n % 100 != 13){ord = 'rd';}
        
        return n+ord;
    }
</script>

{#if team_num != 0}
<div class="team-card" style="--colorA:{alliance == 'red' ? 'rgb(218, 56, 50)' :'rgb(42, 100, 173)'}; --colorB:{alliance == 'red' ? 'hsl(2, 63%, 45%)' : 'hsl(213, 64%, 35%)'}">
    <div class="team-num">{$teamList[team_num]?.display_number?.get()}</div>
    <div class=conts>
        <div class="team-info-label">Team Name</div><div class=team-info-item>{$teamList[team_num]?.team_name?.get()}</div>
        <div class="team-info-label">Robot Name</div><div class=team-info-item>{$teamList[team_num]?.robot_name?.get()}</div>
        {#if $type == "qualification"}
        <div class=team-info-label>Team Rank</div><div class=team-info-item>{getOrdinal($rankingsmap[team_num])}</div>
        {:else}
        {/if}
    </div>
</div>
{/if}

<style lang=scss>
    .conts {
        display:contents;
    }
    .team-info-item {
        font-size: x-large;
    }
    .team-info-label {
        font-size: x-large;
    }
    
    .team-info-item, .team-info-label {
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        &:nth-child(4n+3), &:nth-child(4n+4) {
            background-color:var(--colorB);
        }
    }
    .team-num {
        background-color:var(--colorB);
        font-size: 70px;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        grid-row:1;
        grid-column:1/ span 2;
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
    }
    
    .team-card {
        display:grid;
        grid-template-columns: auto auto;
        grid-template-rows: 100px auto auto auto;
        border-radius: 25px;
        background-color:var(--colorA);
        margin-bottom:10px;
        box-sizing: border-box;
        width:100%;
        height:calc(100% - 10px);
        // height:100%;
    }
</style>