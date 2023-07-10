<script lang="ts">
    import {teamList} from "@store"
    import Team from "./components/Team.svelte"
    import type { TeamData } from "@fowltypes";
    import socket from "@socket";
	import { derived, get } from "svelte/store";
    
    let nextTeam:TeamData = {
        name: "",
        displaynum: "",
        alliance: 0,
        alliancePosition:0,
        id: null
    }
    function addTeam() {
        socket.emit("newTeam", {
            name:nextTeam.name,
            displaynum:nextTeam.displaynum,
            alliance: parseInt(nextTeam.alliance as any) as any,
            alliancePosition:parseInt(nextTeam.alliancePosition as any) as any,
            robotname: nextTeam.robotname,
            id:nextTeam.id
        })
        nextTeam = {
            name: "",
            displaynum: "",
            alliance: 0,
            alliancePosition:0,
            robotname: "",
            id: null
        }
    }

    const teams = derived(teamList, ($teams) => Object.values($teams).sort((a, b) => get(a.displaynum).localeCompare(get(b.displaynum), undefined, {numeric:true, sensitivity:"base"})) )
</script>

<main>
    <h1>Teams</h1>
    <div id=teamlist>
        <div class=tableheader>
            <div class=tableitem>Number</div>
            <div class=tableitem>Display</div>
            <div class=tableitem>Name</div>
            <div class=tableitem>Robot Name</div>
            <div class=tableitem>Alliance</div>
            <div class=tableitem></div>
            <div class=tableitem></div>
        </div>
        {#key $teamList}
            {#each $teams as team, i }
                <Team team={team}/>
            {/each}
        {/key}
        <div id="addrow" class=tablerow>
            <input class="tableitem" type=number bind:value={nextTeam.id}>
            <input class="tableitem centertext" type="string" bind:value={nextTeam.displaynum} />
            <input class="tableitem" type="string" bind:value={nextTeam.name} />
            <input class="tableitem" type="string" bind:value={nextTeam.robotname} />
            <select class="tableitem" bind:value={nextTeam.alliance}>
                <option value=0>None</option>
                <option value=1>Alliance 1</option>
                <option value=2>Alliance 2</option>
                <option value=3>Alliance 3</option>
                <option value=4>Alliance 4</option>
            </select>
            <select class="tableitem" bind:value={nextTeam.alliancePosition}>
                <option value=0>None</option>
                <option value=1>Captain</option>
                <option value=2>Pick 1</option>
                <option value=3>Pick 2</option>
                <option value=4>Pick 3</option>
            </select>
            <button class="tableitem" on:click={addTeam}>+</button>
        </div>
        
    </div>
    <br>
</main>

<style lang="scss">
    #teamlist {
        display:grid;
        grid-template-columns:100px 100px auto auto 150px 150px 50px; 
        grid-auto-flow: row;
    }
    
    #addrow { 
        button.tableitem {
            background-color: green;
        }
        .tableitem {
            margin-top:40px;
        }
    }
    
    
    @import "./event.scss"
    
</style>
