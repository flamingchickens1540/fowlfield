<script lang="ts">
    import matchData, { teamList } from "@store"
    import { type WritableTeamData } from "socketStore";
    import { subscribe } from "svelte/internal";
    import { type Readable, derived, type Writable } from "svelte/store";

    // I think I'm reading the stores wrong
	let {red1, red2, red3, blue1, blue2, blue3, type} = matchData
    $: red = [$red1, $red2, $red3]
    $: blue = [$blue1, $blue2, $blue3]

    // The team numbers aren't updating, they're all still at their defaults
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
            <div>x
                <h2>Alliance Position: {$teamList[$red1].alliancePosition.get()}</h2>
            </div>
        {/if}
        {#each filterTeams(red) as num, i}
            <div id="">
                <strong>
                    <div>Team Number: {$teamList[num].displaynum.get()}</div>
                    <div>Team Name: {$teamList[num].name.get()}</div>
                    <div>Robot Name: {$teamList[num].robotname.get()}</div>
                    <div>Rank: {rankings_red[i] + 1}</div>
                </strong>
            </div>
            <br>
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
                <strong>
                    <div>Team Number: {$teamList[num].displaynum.get()}</div>
                    <div>Team Name: {$teamList[num].name.get()}</div>
                    <div>Robot Name: {$teamList[num].robotname.get()}</div>
                    <div>Rank: {rankings_blue[i] + 1}</div>
                </strong>
            </div>
            <br>
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