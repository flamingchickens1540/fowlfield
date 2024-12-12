<script lang="ts">
    import { slide } from 'svelte/transition'
    import { alliances, rankings, teamList } from '~/lib/store'
    import { derived } from 'svelte/store'
    import AllianceItem from '../components/AllianceItem.svelte'

    const unavailable = new Set<number>()
    const addUnavailable = (team:number|null) => {if (team) {unavailable.add(team)}}
    const nextTeams = derived([teamList, alliances, rankings], ([$teams, $alliances, $rankings]) => {
        unavailable.clear()
        for (let i = 1; i <= 4; i++) {
            addUnavailable($alliances[i]?.captain?.get())
            addUnavailable($alliances[i]?.first_pick?.get())
            addUnavailable($alliances[i]?.second_pick?.get())
            addUnavailable($alliances[i]?.third_pick?.get())
        }
        return $rankings.filter((ranking) => !unavailable.has(ranking.team)).map((ranking) => $teams[ranking.team].display_number.get())
    })

</script>

<div id="alliances">
    <h1>Alliances</h1>
    <div id="allianceGrid">
        {#each Object.values($alliances) as alliance, i}
            <AllianceItem {alliance}></AllianceItem>
        {/each}
    </div>
    <div id="line"></div>
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
    color: white;
  }
  #allianceGrid {
    display:grid;

    grid-template-columns: 1fr 1fr;
    row-gap:5em;
    column-gap:5em;
    grid-template-rows: 1fr 1fr;
    margin:2em;
    .alliance-box {
      background-color:#4c4c4c;
      padding:10px;
      margin:20px;
      border-radius: 10px;
      display:flex;
      flex-direction: column;
    }
    .alliance-member {
        text-align: left;
        position:relative;
        &:nth-child(-n+4) {
          font-weight:500;
        }
        p {
          margin:0;
          position:relative;
          padding-top: 5%;
          padding-bottom: 5%;
          top:50%;
          left:50%;
          transform: translate(-60%, -50%);
          font-size:45px;
        }
      }
      .alliance-label {
        text-align: right;
        position:relative;
        &:nth-child(-n+4) {
          font-weight:500;
        }
        p {
          margin:0;
          position:relative;
          padding-top: 5%;
          padding-bottom: 5%;
          top:50%;
          left:50%;
          transform: translate(-60%, -50%);
          font-size:45px;
        }
      }
    P {
      font-size:35px;
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
    font-size: 35px;
    p {
      line-height: 100%;
      margin: 2.0vh;
    }
    strong {
      font-weight: 700;
    }
  }


  #team-display {
    position: absolute;
    left: 51vw;
    right: 1vw;
    top: 1vw;
    bottom: 1vw;
    text-justify: auto;
    background-color: #4c4c4c;
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
    background-color: #4c4c4c;
    border-radius: 20px;

  }
  h2 {
    color: #FFC145;
  }

  h1 {
    color: #FFC145;
  }
</style>