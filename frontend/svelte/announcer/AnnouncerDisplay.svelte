<script lang="ts">
    // Todo: Display team rank
    import matchData, { teamList } from "@store"

	const {red1, red2, red3, blue1, blue2, blue3, redAlliance, blueAlliance, type} = matchData
    let red: number[] = [$red1, $red2, $red3]
    let blue: number[] = [$blue1, $blue2, $blue3]

    function filterTeams(teams: number[]): number[] {
        return teams.filter((team, _index, _array) => team != 0);
    }
</script>

<h1>Announcer Display</h1>
   
<div id="alliances" class="grid">
    <div id="red">
        <h1 class="text-red-600">Red</h1>
        <h2>Alliance Number: {$redAlliance}</h2>
        {#if $type == 'elimination'}
            <div>
                Alliance Position: {$teamList[red[0]].alliancePosition}
            </div>
        {/if}
        {#each filterTeams(red) as num}
            <div id="">
                Team Number: {$teamList[num].displaynum.get()}
                Team Name: {$teamList[num].name.get()}
                Robot Name: {$teamList[num].robotname.get()}
                Rank: 
            </div>
        {/each}
    </div>
    <div id="blue">
        <h1>Blue</h1>
        <h2>Alliance Number: {$blueAlliance}</h2>
        {#if $type == 'elimination'}
            <div>
                {$teamList[red[0]].alliancePosition}
            </div>
        {/if} 
        {#each filterTeams(blue) as num}
            <div id="">
                Team Number: {$teamList[num].displaynum.get()}
                Team Name: {$teamList[num].name.get()}
                Robot Name: {$teamList[num].robotname.get()}
                Rank: 
            </div>
        {/each}
    </div>
</div>


<style>
    #alliances {
        display: grid;
        place-items: center str;
        grid-column: 2;
        grid-row: 1;
    }

    #red {
        grid-column: 1;
        background-color: rgb(218, 56, 50);
        border-radius: 25px;
    }

    #blue {
        grid-column: 2;
        background-color: rgb(42, 100, 173);
        border-radius: 25px;
    }

    .grid {
        display: grid;
        place-items: center str;
        gap: 10px;
    }
</style>