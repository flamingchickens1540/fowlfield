<script lang=ts>
    import matchData, { fetchMatch, loadedMatch, matchList, preloadedMatch, teamList } from '~/lib/store'
    import { derived, type Readable } from 'svelte/store'
    import socket from '~//lib/socket'
    import type { Match } from '@prisma/client'
    import { prettyMatchID, safeParseInt } from '~common/utils'


    const matchid = matchData.id
    const matchstate = matchData.state
    const { red1, red2, red3, blue1, blue2, blue3 } = matchData
    const matches: Readable<Match[]> = derived(matchList, Object.values)
    const teams = derived([teamList], ([$teamList]) => {
        return Object.values($teamList).sort((a, b) => a.display_number.get().localeCompare( b.display_number.get()))
    })
    function getMatchColor(id: string) {
        if ($loadedMatch == id) return 'background-color:#680066'
        if ($preloadedMatch == id) return 'background-color:#683900'
        if ($matchid == id) return 'background-color:#006866'
        return ''
    }

    matchData.state.subscribe((state) => {
        red1.setWritable(state == "not_started")
        red2.setWritable(state == "not_started")
        red3.setWritable(state == "not_started")
        blue1.setWritable(state == "not_started")
        blue2.setWritable(state == "not_started")
        blue3.setWritable(state == "not_started")
    })


    function onTeamClick(e: MouseEvent & {     currentTarget: (EventTarget & HTMLButtonElement) }) {
        if (matchData.state.get() != "not_started") {
            return
        }
        const state = e.currentTarget.getAttribute("data-state")
        const team = safeParseInt(e.currentTarget.getAttribute("data-team"))
        if (!team) {
            console.warn(e.currentTarget)
            return
        }
        if (state != "none") {
            const [a, b, c] = state == "red" ? [red1, red2, red3] : [blue1, blue2, blue3]
            if (a.get() == team) {
                a.set(0)
            } else if (b.get() == team) {
                b.set(0)
            } else if (c.get() == team) {
                c.set(0)
            }
        } else {
            const [a, b, c] = currentlyEditing == "red" ? [red1, red2, red3] : [blue1, blue2, blue3]
            if (a.get() == 0) {
                a.set(team)
            } else if (b.get() == 0) {
                b.set(team)
            } else if (c.get() == 0) {
                c.set(team)
            } else {
                return
            }
        }
    }
    let currentlyEditing:"red"|"blue" = "red"
</script>

<main>
    <div id="sidebar-l">
        <h2>Matches</h2>
        <div id=matchGrid>
            {#each $matches as match,i}
                <div class="matchEntry" style="{getMatchColor(match.id)}">
                    <span>{match.id}</span>
                    <button disabled={match.id == $matchid} class="loadButton" on:click={() => (fetchMatch(match.id))}>
                        Open
                    </button>
                </div>
            {/each}
        </div>
        <button on:click={() => socket.emit("nextMatch", "qualification")} style="width:100%;font-size:25px;">New
            Match
        </button>
    </div>
    <div id="maincontainer" style="{$matchstate != 'not_started' ? 'filter:brightness(60%); cursor:not-allowed' : ''}">
        <h1>{prettyMatchID($matchid)}</h1>
        <div id="teamcontainer">
            <div on:click={() => currentlyEditing = "red"} class="col alliance {currentlyEditing == 'blue'?'inactive':'active'}" style="background-color:var(--red)">
                <button disabled={currentlyEditing == "red"}>Edit Red</button>
                <div on:click={() => $red1 = 0} class="item">{$teamList[$red1]?.display_number?.get() ?? "*"}</div>
                <div on:click={() => $red2 = 0} class="item">{$teamList[$red2]?.display_number?.get() ?? "*"}</div>
                <div on:click={() => $red3 = 0} class="item">{$teamList[$red3]?.display_number?.get() ?? "*"}</div>
            </div>
            <div on:click={() => currentlyEditing = "blue"} class="col alliance {currentlyEditing == 'red'?'inactive':'active'}" style="background-color:var(--blue)">
                <button disabled={currentlyEditing == "blue"}>Edit Blue</button>
                <div on:click={() => $blue1 = 0} class="item">{$teamList[$blue1]?.display_number?.get() ?? "*"}</div>
                <div on:click={() => $blue2 = 0} class="item">{$teamList[$blue2]?.display_number?.get() ?? "*"}</div>
                <div on:click={() => $blue3 = 0} class="item">{$teamList[$blue3]?.display_number?.get() ?? "*"}</div>
            </div>
            <div class="unsorted" style="grid-column: auto/span 2;background-color:#afafaf">
                {#each $teams as team}
                    <button class="item" on:click={onTeamClick} data-team="{team.id.get()}" data-state="{($red1==team.id.get() || $red2==team.id.get() || $red3==team.id.get()) ? 'red' : ($blue1==team.id.get() || $blue2==team.id.get() || $blue3==team.id.get()) ? 'blue' : 'none'}">
                        {team.display_number.get()}
                    </button>
                {/each}
            </div>
        </div>
    </div>
</main>

<style lang=scss>
  .unsorted {
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    grid-template-rows: repeat(auto-fill, 70px);
    padding:10px;
    margin-top: 20px;
    .item {
      font-size: 25px;
    }
  }
  .col {
    display:flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    > * {
      width:50%
    }
    &:not(.inactive) {
      border:5px solid #ffffffa0;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      z-index:10;
    }
    &.inactive {
      border: 5px solid #00000000;
      filter: brightness(0.9);
    }
    .item {
      cursor: pointer;
    }
  }

  .item[data-state="red"] {
    background-color: #ff0000a0;
  }
  .item[data-state="blue"] {
    background-color: #0000ffa0;
  }
  .item[data-state="none"] {
    background-color: rgba(134, 134, 134, 0.63);
  }
  .item {
    font-size: 25px;
    padding:10px;
    margin:5px;
    border-radius: 10px;
    background-color: #90909060;
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
    height: 80%;
    grid-template-rows: 1fr 3fr;
    grid-template-columns: 1fr 1fr;
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