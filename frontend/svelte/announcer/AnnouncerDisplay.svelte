<script lang="ts">
    import matchData, { teamList } from "@store"
    import { type WritableTeamData } from "socketStore";
    import { type Readable, derived } from "svelte/store";

	const {red1, red2, red3, blue1, blue2, blue3, redAlliance, blueAlliance, type} = matchData
    let red: number[] = [$red1, $red2, $red3]
    let blue: number[] = [$blue1, $blue2, $blue3]

    function filterTeams(teams: number[]): number[] {
        return teams.filter((team, _index, _array) => team != 0);
    }
    let teamsSorted: Readable<WritableTeamData[]> = derived(teamList, ($teams) =>
		(Object.values($teams) ?? []).sort(
			(a, b) => b.matchStats.get().rp - a.matchStats.get().rp
		)
	);
    // If there's a better way to do this let me know
    // It might be helpful to just have a rankings store
    $teamsSorted.forEach((team, index, _array) => {
        switch (team.id) {
            case $red1: {
                rankings_red[1] = index;
                break;
            }
            case $red2: {
                rankings_red[2] = index;
                break;
            }
            case $red3: {
                rankings_red[3] = index;
                break;
            }
            case $blue1: {
                rankings_blue[1] = index;
                break;
            }
            case $blue2: {
                rankings_blue[2] = index;
                break;
            }
            case $blue3: {
                rankings_blue[3] = index;
                break;
            }
            default: {
                break;
            }
        }
    })
    let rankings_red:(number | null)[] = [null, null, null]
    let rankings_blue:(number | null)[] = [null, null, null]
</script>

<h1>Announcer Display</h1>

<div id="alliances" class="grid">
    <div id="red">
        <h1 class="text-red-600">Red Alliance</h1>
        {#if $type == 'elimination'}
            <div>
                <h2>Alliance Position: {$teamList[$red1].alliancePosition.get()}</h2>
            </div>
        {/if}
        {#each filterTeams(red) as num, i}
            <div id="">
                Team Number: {$teamList[num].displaynum.get()}
                Team Name: {$teamList[num].name.get()}
                Robot Name: {$teamList[num].robotname.get()}
                Rank: {rankings_red[i] + 1}
            </div>
        {/each}
    </div>
    <div id="blue">
        <h1>Blue Alliance</h1>
        {#if $type == 'elimination'}
            <div>
                <h2>Alliance Position: {$teamList[$red1].alliancePosition.get()}</h2>
            </div>
        {/if} 
        {#each filterTeams(blue) as num, i}
            <div id="">
                Team Number: {$teamList[num].displaynum.get()}
                Team Name: {$teamList[num].name.get()}
                Robot Name: {$teamList[num].robotname.get()}
                Rank: {rankings_blue[i] + 1}
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