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
    // type.set("elimination");
    // If there's a better way to do this let me know
    // It might be helpful to just have a rankings store
    $teamsSorted.forEach((team, index, _array) => {
        switch (team.id) {
            case $red1: {
                rankings_red[0] = index;
                break;
            }
            case $red2: {
                rankings_red[1] = index;
                break;
            }
            case $red3: {
                rankings_red[2] = index;
                break;
            }
            case $blue1: {
                rankings_blue[0] = index;
                break;
            }
            case $blue2: {
                rankings_blue[1] = index;
                break;
            }
            case $blue3: {
                rankings_blue[2] = index;
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

<h2 class="text-red-600">Announcer Display</h2>

<div id="alliances" class="grid grid-cols-2">
    <div class="grid grid-cols-1">
        <h1>Red Alliance</h1>
        {#if $type == 'elimination'}
            <div>
                <h3>Alliance Position: {$teamList[filterTeams(red)[0]].alliancePosition.get()}</h3>
            </div>
        {/if}
        {#each filterTeams(red) as num, i}
            <div class="team-card{i + 1} red">
                <strong>
                    <div class="team-num">{$teamList[num].displaynum.get()}</div>
                    <div class="team-info">
                        <div class="team-info-item">Team Name: {$teamList[num].name.get()}</div>
                        <div class="team-info-item">Robot Name: {$teamList[num].robotname.get()}</div>
                        <div>Rank: {rankings_red[i] + 1}</div>
                    </div>
                </strong>
            </div>
            <br>
        {/each}
    </div>
    <div class="grid grid-cols-1">
        <h1>Blue Alliance</h1>
        {#if $type == 'elimination'}
            <div>
                <h3>Alliance Position: {$teamList[$red1].alliancePosition.get()}</h3>
            </div>
        {/if} 
        {#each filterTeams(blue) as num, i}
            <div class="team-card{i + 1 } blue">
                <strong>
                    <div class="team-num">{$teamList[num].displaynum.get()}</div>
                    <div class="team-info">
                        <div class="team-info-item">Team Name: {$teamList[num].name.get()}</div>
                        <div class="team-info-item">Robot Name: {$teamList[num].robotname.get()}</div>
                        <div>Rank: {rankings_blue[i] + 1}</div>
                    </div>
                </strong>
            </div>
            <br>
        {/each}
    </div>
</div>


<style>
    .team-info-item {
        padding-bottom: 1%;
    }
    .team-info {
        font-size: x-large;
    }
    .team-num {
        font-size: xxx-large;
        padding-bottom: 2%;
    }

    .red {
        background-color: rgb(218, 56, 50);
        border-radius: 25px;
    }

    .blue {
        background-color: rgb(42, 100, 173);
        border-radius: 25px;
    }
    
    .team-card1 {
        padding-bottom: 2%;
        padding-top: 2%;
        grid-row: 2;
    }
    .team-card2 {
        padding-bottom: 2%;
        padding-top: 2%;
        grid-row: 3;
    }
    .team-card3 {
        padding-bottom: 2%;
        padding-top: 2%;
        grid-row: 4;
    }

    .grid {
        display: grid;
        place-items: center str;
        gap: 10px;
    }

    .grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
</style>