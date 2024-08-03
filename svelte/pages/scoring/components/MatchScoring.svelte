<script lang="ts">
    import type {DriverStation} from "~common/types";
    import socket from "~//lib/socket";
    import matchData, {dsStatuses, teamList} from "~/lib/store";
    import writableDerived from "svelte-writable-derived";
    import {derived, get} from "svelte/store";
    import {driverstations} from "../Scoring.svelte";
    import EstopConfirm from "./EstopConfirm.svelte";

    export let station: 1 | 2 | 3;
    export let alliance: "red" | "blue";
    export const pos = `${alliance}${station}`;
    export const dsposstring = ((alliance == "red" ? "R" : "B") + station) as DriverStation;
    const robot = derived([matchData[pos], teamList], ([$teamid, $teams]) => $teams[$teamid]?.displaynum?.get() ?? "0");
    const scoreBreakdown = alliance == "red" ? matchData.redScoreBreakdown : matchData.blueScoreBreakdown;
    const scoreBreakdownOpponent = alliance == "red" ? matchData.blueScoreBreakdown : matchData.redScoreBreakdown;

    $: if ($scoreBreakdown == null) {
        $scoreBreakdown = {
            autoBunnyCount: 0,
            autoTaxiBonus: [false, false, false],
            finalBunnyCount: 0,
            targetHits: [0, 0, 0],
            endgameParkBonus: [false, false, false],
            fouls: []
        };
    }
    $: if ($scoreBreakdownOpponent == null) {
        $scoreBreakdownOpponent = {
            autoBunnyCount: 0,
            autoTaxiBonus: [false, false, false],
            finalBunnyCount: 0,
            targetHits: [0, 0, 0],
            endgameParkBonus: [false, false, false],
            fouls: []
        };
    }
    let lastHitTime: number = 0;
    let undoStopwatchValue = "-";

    function registerHit() {
        lastHitTime = Date.now();
        socket.emit("registerHit", dsposstring);
    }

    function undoHit() {
        lastHitTime = 0;
        socket.emit("undoHit", dsposstring);
    }

    function registerFoul(value: number) {
        scoreBreakdownOpponent.update((breakdown) => {
            breakdown.fouls.push({robot: get(matchData[pos]), timestamp: Date.now(), value});
            return breakdown;
        });
    }

    async function estop() {
        const didConfirm = await estopconfirm.confirm();
        if (didConfirm) {
            socket.emit("estop", driverstations[pos]);
        }
    }

    export let estopconfirm: EstopConfirm;
    setInterval(() => {
        const time = Math.round((Date.now() - lastHitTime) / 1000);
        undoStopwatchValue = time > 15 ? "—" : time + "s";
    }, 500);

    let disableHitButton = false;

    dsStatuses.subscribe((statuses) => {
        if (statuses == null) {
            return;
        }
        const station = statuses[dsposstring];
        disableHitButton = station.bypassed ? false : !station.robotConnected || station.isEstopped || !station.enabled;
    });

    const didTaxi = writableDerived(
        scoreBreakdown,
        ($breakdown) => $breakdown.autoTaxiBonus[station - 1],
        (newVal, $breakdown) => {
            $breakdown.autoTaxiBonus[station - 1] = newVal;
            return $breakdown;
        }
    );
    const didPark = writableDerived(
        scoreBreakdown,
        ($breakdown) => $breakdown.endgameParkBonus[station - 1],
        (newVal, $breakdown) => {
            $breakdown.endgameParkBonus[station - 1] = newVal;
            return $breakdown;
        }
    );
</script>

<EstopConfirm bind:this={estopconfirm}>
    <span slot="robot">{$robot}</span>
</EstopConfirm>
<div class="scoring-container" style="--buttoncolor:{alliance == 'red' ? 'rgb(122, 0, 0)' : 'rgb(0, 45, 122)'}">
    <button style="grid-column:1/span 2; height:100%; background-color:var(--buttoncolor); font-size:25px;display:flex;align-items:center;justify-content:center;"
            on:click={() => (window.location.pathname = "/scoring/" + prompt("What station are you"))}>
        <span>{pos.toUpperCase()} - {$robot}</span>
    </button>
    <div style="font-size:40px;">
        <div style="width:100%;height:calc(50% - 10px);padding-bottom:10px;margin:0;">
            <button class="btn" style="height:100%; width:100%;margin:0;" on:click={() => registerFoul(5)}>5pt Foul
            </button>
        </div>
        <div style="width:100%;height:calc(50% - 10px);padding-top:10px;margin:0;">
            <button class="btn" style="height:100%; width:100%;margin:0;" on:click={() => registerFoul(10)}>10pt Foul
            </button>
        </div>
    </div>
    <div id="misccontainer">
        <div class="bunnycontainer">
            <span style="font-size:25px;">Auto Bunnies</span>
            <div class="bunnybuttons">
                <button class="red-button bunny-btn" on:click={() => $scoreBreakdown.autoBunnyCount = Math.max($scoreBreakdown.autoBunnyCount-1, 0)}><span>-</span>
                </button>
                <input type="number" bind:value={$scoreBreakdown.autoBunnyCount}/>
                <button class="green-button bunny-btn" on:click={() => $scoreBreakdown.autoBunnyCount++}><span>+</span>
                </button>
            </div>
        </div>
        <div class="bunnycontainer">
            <span style="font-size:25px;">Endgame Bunnies</span>
            <div class="bunnybuttons">
                <button class="red-button bunny-btn" on:click={() => $scoreBreakdown.finalBunnyCount = Math.max($scoreBreakdown.finalBunnyCount-1, 0)}><span>-</span>
                </button>
                <input inputmode="numeric" type="number" bind:value={$scoreBreakdown.finalBunnyCount}/>
                <button class="green-button bunny-btn" on:click={() => $scoreBreakdown.finalBunnyCount++}><span>+</span>
                </button>
            </div>
        </div>
        <button class=mobilitybutton on:click={() => ($didTaxi = !$didTaxi)}
                style="background-color:{$didTaxi ? '#7e727e' : '#1a1a1a'}">
            Taxi
        </button>
        <button class=mobilitybutton on:click={() => ($didPark = !$didPark)}
                style="background-color:{$didPark ? '#727e72' : '#1a1a1a'}">
            Park
        </button>
    </div>

    <div>
        <button class="btn"
                style="width:100%;height:100%;;box-sizing:border-box;margin:0;font-size:60px;background-color:black;border:1px solid #a0a0a0"
                on:click={estop}>Estop
        </button>
    </div>
    <div class="hit-tracker">
        <button class="red-button btn" style="width:100%;height:70%;;box-sizing:border-box;margin:0;font-size:60px;"
                on:click={registerHit}>Hit
            ({$scoreBreakdownOpponent.targetHits[station - 1] ?? 0})
        </button>
        <div style="width:100%;height:calc(30% - 10px);padding-top:10px;margin:0;">
            <button class="btn" style="width:100%;height:100%;margin:0;font-size:40px;background-color:orange"
                    on:click={undoHit}>Undo ({undoStopwatchValue})
            </button>
        </div>
    </div>
</div>

<style lang="scss">
  #misccontainer {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-auto-flow: column;
  }

  .scoring-container {
    display: grid;
    position: absolute;
    top: 5px;
    bottom: 5px;
    left: 5px;
    right: 5px;
    padding: 5px;
    max-height: 100vh;
    gap: 25px;
    overflow: hidden;
    grid-template-rows: 50px 40% 45%;
    grid-template-columns: 3fr 5fr;
    grid-auto-flow: row;

    > * {
      border: 1px white dashed;
    }
  }

  .btn {
    background-color: var(--buttoncolor, rgb(122, 0, 0));
  }

  .red-button {
    background-color: rgb(122, 0, 0);
  }

  .green-button {
    background-color: green;
  }

  .bunnybuttons {
    flex-direction: row;
    display: flex;
    justify-content: center;
    align-items: center;
    //width:80%;
  }

  .bunnycontainer {
    background-color: #433e44;
    padding: 10px;
    margin: 3px;
    border-radius: 5px;
  }

  .bunnybuttons > * {
    height: 50px;
    font-size: 40px;
  }

  .bunnybuttons input {
    width: 120px;
    height: 50px;
    text-align: center;
    border-radius: 0;
  }

  .bunny-btn {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin:0;
    padding:35px;
    span {
      margin: 0;
      padding: 0;
    }
    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  .mobilitybutton {
    font-size: 50px;

    margin: 2px;
  }

</style>
