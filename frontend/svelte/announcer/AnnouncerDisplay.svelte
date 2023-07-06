<script lang="ts">
    import matchData, { teamList } from "@store"
    import { teamsSorted } from "@store";
    import TeamCard from "./components/TeamCard.svelte";

	const {red1, red2, red3, blue1, blue2, blue3, type} = matchData
    let red: 'red' | 'blue' = 'red'
    let blue: 'red' | 'blue' = 'blue'

    // function filterTeams(teams: number[]): number[] {
    //     return teams.filter((team, _index, _array) => team != 0);
    // }
    let rankings_red = {}
    let rankings_blue = {}
    type.set('elimination'); // for testing
    // Rank can't be properly tested until scoring works
    // If there's a better way to do this let me know
    // It might be helpful to just have a rankings store
    teamsSorted.subscribe((teams) => teams.forEach((team, index, _array) => {
        switch (team.id) {
            case $red1: {
                rankings_red[$red1] = index;
                break;
            }
            case $red2: {
                rankings_red[$red2] = index;
                break;
            }
            case $red3: {
                rankings_red[$red3] = index;
                break;
            }
            case $blue1: {
                rankings_blue[$blue1] = index;
                break;
            }
            case $blue2: {
                rankings_blue[$blue2] = index;
                break;
            }
            case $blue3: {
                rankings_blue[$blue3] = index;
                break;
            }
            default: {
                break;
            }
        }
    }))
    
</script>

<h2>Announcer Display</h2>

<div class="grid-cols-2">
    <div class="grid-rows-flux">
        <h1>Red Alliance</h1>
        {#if $type == 'elimination'}
            <div>
                <h2>Alliance Position: {$teamList[$red1].alliance.get()}</h2> <!--This isn't working and I can't tell why-->
            </div>
        {/if}
        {#if $red1 != 0 || $red2 != 0 || $red3 != 0}
            <TeamCard bind:alliance={red} bind:team_num={$red1} bind:rank={rankings_red[$red1]}/>
            <TeamCard bind:alliance={red} bind:team_num={$red2} bind:rank={rankings_red[$red2]}/>
            <TeamCard bind:alliance={red} bind:team_num={$red3} bind:rank={rankings_red[$red3]}/>
        {/if}
    </div>
    <div class="grid-rows-flux">
        <h1>Blue Alliance</h1>
        {#if $type == 'elimination'}
            <div>
                <h2>Alliance Position: {$teamList[$red1].alliancePosition.get()}</h2> <!--This isn't working and I can't tell why-->
            </div>
        {/if} 
        {#if $blue1 != 0 || $blue2 != 0 || $blue3 != 0}
            <TeamCard bind:alliance={blue} bind:team_num={$blue1} bind:rank={rankings_blue[$blue1]}/>
            <TeamCard bind:alliance={blue} bind:team_num={$blue2} bind:rank={rankings_blue[$blue2]}/>
            <TeamCard bind:alliance={blue} bind:team_num={$blue3} bind:rank={rankings_blue[$blue3]}/>
        {/if}
    </div>
</div>


<style>

    .grid-rows-flux {
        display: grid;
        place-items: center str;
        gap: 10px;
        grid-template-rows: 1fr auto
    }

    .grid-cols-2 {
        display: grid;
        place-items: center str;
        gap: 10px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .half-row {
        grid-row-start: 2;
        grid-row-end: 2.5;
    }
</style>