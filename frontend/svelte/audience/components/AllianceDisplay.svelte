<script lang="ts">
    import {fade, slide} from "svelte/transition";
    import {teamList, teamsSorted} from "@store";
    import {derived} from "svelte/store";

    export const alliances = derived(teamList, ($teamList) => {
        const list = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
        Object.values($teamList).forEach((team) => {
            if (team.alliance.get() == 0 || team.alliancePosition.get() == 0) {return}
            list[team.alliance.get()-1][team.alliancePosition.get()-1] = team.id
        })
        return list
    })

    const nextTeams = derived(teamsSorted, (teams) => teams.filter((team) => team.alliance.get() == 0).map((team) => team.displaynum.get()))

</script>

<div id="alliances">
    <h1>Alliances</h1>
    <div id="allianceGrid">
        {#each $alliances as alliance, i}
            <div class="alliance-box">
                <h2>Alliance {i + 1}</h2>

                <div class=alliance-teams>
                    <div class="alliance-member"><p>Captain</p></div>
                    <div class="alliance-member"><p>1st Pick</p></div>
                    <div class="alliance-member"><p>2nd Pick</p></div>
                    <div class="alliance-member"><p>3rd Pick</p></div>
                    {#each alliance as team}
                        <div transition:fade class="alliance-member">
                            <p>{$teamList[team]?.displaynum.get() ?? ""}</p>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<div id="team-display">
    <h1>Available Teams</h1>
    <div id="teamGrid">
        {#each $nextTeams as team, i}
            <div class="team-box" transition:slide|local>
                <p><strong>{i + 1})</strong> {team}</p>
            </div>
        {/each}
    </div>
</div>
<div id="greenscreen" style="background-color: #0f0">

</div>

<style lang="scss">
  p {
    color: black;
  }
  #allianceGrid {
    display:grid;

    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(2, 40vh);
    .alliance-box {
      background-color:#f7dc99;
      padding:10px;
      margin:20px;
      border-radius: 10px;
      display:flex;
      flex-direction: column;
    }
    .alliance-member {
      text-align: center;
      position:relative;
      &:nth-child(-n+4) {
        font-weight:500;
      }
      p {
        margin:0;
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        font-size:65px;
      }
    }
    P {
      font-size:25px;
    }
    h2 {
      font-size:80px;
    }

  }
  .alliance-teams {
    flex: 1;
    display:grid;
    grid-template-rows:auto auto auto auto;
    grid-auto-flow: column;
    grid-template-columns: 65% 35%;
  }
  #teamGrid {
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-template-rows: repeat(6, auto);
    grid-auto-flow: column;
  }
  .team-box {
    display: block;
    border-radius: 25px;
    text-align: left;
    padding-left: 20px;
    font-size: 65px;
    p {
      line-height: 100%;
      margin: 2.6vh;
    }
    strong {
      font-weight: 900;
    }
  }


  #team-display {
    position: absolute;
    left: 51vw;
    right: 1vw;
    top: 1vw;
    bottom: 1vw;
    text-justify: auto;
    background-color: #f7dc99;
    justify-content: center;
    border-radius: 25px;
    align-items: center;
  }

  #greenscreen {
    position:absolute;
    top:60vh;
    left:53vw;
    right:3vw;
    bottom:3vw;
    display:block;
    z-index: 200;
    border-radius:20px;
  }

  #alliances {
    position: absolute;
    left: 1vw;
    right: 51vw;
    top: 1vw;
    bottom: 1vw;
    background-color: #eea19c;
    border-radius: 20px;

  }
  h2 {
    color: black;
  }

  h1 {
    color: black;
  }
</style>