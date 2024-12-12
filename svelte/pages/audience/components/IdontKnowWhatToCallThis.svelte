<script lang="ts">
    import type { PlayoffAlliance } from "@prisma/client"
    import { fade } from "svelte/transition"
    import type { SocketWritableOf } from "~/lib/socketStore"
    import { teamList } from "~/lib/store"

    export let alliance: SocketWritableOf<PlayoffAlliance>

    const{seed, captain, first_pick, second_pick, third_pick} = alliance
</script>

<div class="alliance-box">
    <h2 style="font-size: 40px;">Alliance {$seed}</h2>

    <div class=alliance-teams>
        <div class="alliance-label"><strong><p>Captain</p></strong></div>
        <div class="alliance-label"><strong><p>1st Pick</p></strong></div>
        <div class="alliance-label"><strong><p>2nd Pick</p></strong></div>
        <div class="alliance-label"><strong><p>3rd Pick</p></strong></div>
        <div transition:fade class="alliance-member">
          <p>{$teamList[$captain??0]?.display_number.get() ?? ""}</p>
      </div>
      <div transition:fade class="alliance-member">
        <p>{$teamList[$first_pick??0]?.display_number.get() ?? ""}</p>
    </div>
    <div transition:fade class="alliance-member">
        <p>{$teamList[$second_pick??0]?.display_number.get() ?? ""}</p>
    </div>
    <div transition:fade class="alliance-member">
        <p>{$teamList[$third_pick??0]?.display_number.get() ?? ""}</p>
    </div>
    </div>
</div>

<style lang="scss">
    p {
      color: white;
    }
    #allianceGrid {
      display:grid;
  
      grid-template-columns: repeat(2, 50%);
      grid-template-rows: repeat(2, 40vh);
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
        font-size:45px;
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