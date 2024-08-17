<script lang=ts>
    import matchData, { loadedMatch, matchList, preloadedMatch, teamList } from '~/lib/store'
    import { derived, type Readable } from 'svelte/store'

    import TeamDatalistEntry from '../../lib/components/TeamDatalistEntry.svelte'
    import socket, { onLoaded } from '~//lib/socket'
    import type { Match, Team } from '@prisma/client'
    import { onMount } from 'svelte'
    import Sortable, { Swap } from 'sortablejs'
    import type { RobotPosition } from '~common/types'
    import { safeParseInt } from '~common/utils'
    import type { SocketWritable, SocketWritableOf } from '~/lib/socketStore'


    const matchid = matchData.id
    const matchstate = matchData.state
    const { red1, red2, red3, blue1, blue2, blue3 } = matchData
    const assigned = [red1, red2, red3, blue1, blue2, blue3]
    const matches: Readable<Match[]> = derived(matchList, Object.values)
    const teams = derived([teamList], ([$teamList]) => {
        return Object.values($teamList)
    })
    function getMatchColor(id: string) {
        if ($loadedMatch == id) return 'background-color:#680066'
        if ($preloadedMatch == id) return 'background-color:#683900'
        if ($matchid == id) return 'background-color:#006866'
        return ''
    }

    function setAssigned(team:number) {

        const isAssigned = assigned.some((id) => id.get() == team)
        console.log("setting assigned", team, isAssigned)
        const elem = unsortedParent.querySelector(`[data-team="${team}"`)!
        if (isAssigned) {
            elem!.classList.add("assigned")
        } else {
            elem?.classList.remove("assigned")
        }
    }

    function configureTeamStore(store:SocketWritable<number>, parent:HTMLElement, index:0|1|2) {
        store.setWritable()
        let isFirst = true
        store.subscribe((value) => {
            if (isFirst) setTimeout(() => document.getElementById(`team-${value}`)?.classList.add("assigned"), 50)
            isFirst = false
            const item = parent.children.item(index)!
            item.setAttribute("data-team", value.toString())
            item.innerHTML = $teamList[value]?.display_number.get() ?? "Empty"
            parent.children.item(3)?.remove()
        })
    }



    let setSortingEnabled: (enabled: boolean) => void = () => {}
    onMount(() => {
        onLoaded(() => {
            configureTeamStore(red1, redTeamParent, 0)
            configureTeamStore(red2, redTeamParent, 1)
            configureTeamStore(red3, redTeamParent, 2)
            configureTeamStore(blue1, blueTeamParent, 0)
            configureTeamStore(blue2, blueTeamParent, 1)
            configureTeamStore(blue3, blueTeamParent, 2)
        })
        Sortable.mount(new Swap());
        function onEnd(event: Sortable.SortableEvent) {
            console.log(event)
            const destTeam = safeParseInt(event.swapItem?.getAttribute("data-team"))
            const fromTeam = safeParseInt(event.item.getAttribute("data-team"))
            const destIsAlliance = event.to.classList.contains("alliance")
            const fromIsAlliance = event.from.classList.contains("alliance")
            if (destIsAlliance && !fromIsAlliance) {
                event.item.remove()
            }
            if (event.from.classList.contains("alliance")) {
                const pos = event.from.getAttribute("data-alliance")!+(event.oldIndex!+1) as RobotPosition
                matchData[pos].set(destTeam??0)
                console.log("setting", pos, destTeam)
            }

            if (event.to.classList.contains("alliance")) {
                const pos = event.to.getAttribute("data-alliance")!+(event.newIndex!+1) as RobotPosition
                matchData[pos].set(fromTeam??0)
                console.log("setting", pos, fromTeam)
            }
            if (fromTeam != null) setAssigned(fromTeam)
            if (destTeam != null) setAssigned(destTeam)

        }

        const unassignedSortable = new Sortable(unsortedParent, {
            draggable: '.item',
            group: {
                name:'teams',
                pull: "clone",
                put: false
            },
            filter: ".assigned",
            sort: false,
            swap: false,
            onEnd
        })
        const redSortable = new Sortable(redTeamParent, {
            draggable: '.item',
            group: {
                name:'teams',
                put: (to, from) => to.el.children.length < 3 || from.el.classList.contains("alliance")
            },
            swap: true,
            sort: true,
            onEnd
        })

        const blueSortable = new Sortable(blueTeamParent, {
            draggable: '.item',
            group: {
                name:'teams',
                put: (to, from) => to.el.children.length < 3 || from.el.classList.contains("alliance")
            },
            swap: true,
            sort: true,
            onEnd
        })
        setSortingEnabled = (enabled) => {
            redSortable.option('sort', enabled)
            redSortable.option('group', {
                name: 'teams',
                pull: enabled,
                put: enabled
            })
            blueSortable.option('sort', enabled)
            blueSortable.option('group', {
                name: 'teams',
                pull: enabled,
                put: enabled
            })
        }

    })

    $: setSortingEnabled($loadedMatch != $matchid || $matchstate == "not_started")

    let redTeamParent: HTMLElement
    let blueTeamParent: HTMLElement
    let unsortedParent: HTMLElement

</script>


<datalist id="teams">
    {#each Object.values($teamList) as team}
        <TeamDatalistEntry {team}></TeamDatalistEntry>
    {/each}
</datalist>

<main>
    <div id="sidebar-l">
        <h2>Matches</h2>
        <div id=matchGrid>
            {#each $matches as match,i}
                <div class="matchEntry" style="{getMatchColor(match.id)}">
                    <span>{match.id}</span>
                    <button disabled={match.id == $matchid} class="loadButton" on:click={() => $matchid = match.id}>
                        Open
                    </button>
                </div>
            {/each}
        </div>
        <button on:click={() => socket.emit("nextMatch", "qualification")} style="width:100%;font-size:25px;">New
            Match
        </button>
    </div>
    <div id="maincontainer">
        <h1>{$matchid}</h1>
        <div id="teamcontainer">
            <div class="col alliance" style="background-color:var(--red)" data-alliance="red" bind:this={redTeamParent}>
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
            </div>
            <div class="col alliance" style="background-color:var(--blue)" data-alliance="blue" bind:this={blueTeamParent}>
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
            </div>
            <div class="col" style="background-color:#afafaf" bind:this={unsortedParent}>
                <div class="item" style="background-color:#afafafa0">
                    Empty
                </div>
                {#each $teams as team}
                    <!--{#if !assigned.some((id) => id.get() == team.id.get())}-->
                        <div class="item" id="team-{team.id.get()}" data-team="{team.id.get()}" style="background-color:#afafaf60">
                            {team.display_number.get()}
                        </div>
                    <!--{/if}-->
                {/each}
            </div>
        </div>
    </div>
</main>

<style lang=scss>
  .item {
    background-color:#afafaf60
  }
  :global(.item.assigned) {
    background-color: #b9b202a0 !important;
  }
  #maincontainer {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  #teamcontainer {
    display: grid;
    margin: 5px;
    width: 90%;
    height: 70%;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
  }

  main {
    color: white;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #sidebar-l {
    height: 100%;
    width: 340px;
    background-color: #303030;
    padding: 10px;
  }

  :global(body) {
    margin: 0;
  }

  #matchGrid {
    display: flex;
    flex-flow: column nowrap;
    overflow-y: scroll;

    .matchEntry:first-child {
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }

    .matchEntry:last-child {
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
    }

    padding-right: 0;
    max-height: 76vh;
    width: 320px;
    // &::-webkit-scrollbar {display: none;}
  }

  .matchEntry {
    background-color: rgba(100, 100, 100, 0.5);

    &:nth-child(odd) {
      background-color: rgba(100, 100, 100, 0.3);
    }

    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    width: 300px;
    padding: 10px 10px;
    align-items: center;

    & > * {
      margin-left: 5px;
      margin-right: 5px;
    }


    span {
      flex-grow: 2;
      font-size: 30px;
      text-transform: uppercase;
    }

    button {
      padding: 0.2em 0.7em;
      font-size: 25px;
      width: 120px;
      height: 60px;
      background-color: #1a1a1af0;
    }
  }

  :global(:root) {
    touch-action: none;
    height: 100%;
    overscroll-behavior-y: none;
  }

  :global(body) {
    margin: 0 !important;
    padding: 0;
  }
</style>