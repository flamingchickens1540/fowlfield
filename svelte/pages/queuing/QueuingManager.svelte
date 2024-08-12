<script lang=ts>
    import matchData, {loadedMatches, matchList, teamList} from "~/lib/store";
    import {derived, type Readable} from "svelte/store";
    import type {MatchData} from "~common/types";
    import QueueItem from "./components/QueueItem.svelte";
    import TeamDatalistEntry from "../../lib/components/TeamDatalistEntry.svelte";
    import socket from "~//lib/socket";

    const {loaded: loadedMatch, preloaded: preloadedMatch} = loadedMatches

    const matchid = matchData.id
    const matches: Readable<MatchData[]> = derived(matchList, Object.values)

    function getMatchColor(id) {
        if ($loadedMatch == id) return "background-color:#680066"
        if ($preloadedMatch == id) return "background-color:#683900"
        if ($matchid == id) return "background-color:#006866"
        return ""
    }

    const {red1, red2, red3, blue1, blue2, blue3} = matchData
</script>

<datalist id="teams">
    {#each Object.values($teamList) as team}
        <TeamDatalistEntry {team}></TeamDatalistEntry>
    {/each}

    }
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
            <QueueItem label="Red 1" store={red1}></QueueItem>
            <QueueItem label="Red 2" store={red2}></QueueItem>
            <QueueItem label="Red 3" store={red3}></QueueItem>
            <QueueItem label="Blue 1" store={blue1}></QueueItem>
            <QueueItem label="Blue 2" store={blue2}></QueueItem>
            <QueueItem label="Blue 3" store={blue3}></QueueItem>
        </div>
    </div>
</main>

<style lang=scss>

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
    color:white;
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