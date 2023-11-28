<script lang="ts">
    import type { DriverStation, RobotHitState } from "@fowltypes";
    import { driverstations } from "../Scoring.svelte";
    import matchData, { dsStatuses, teamList } from "@store";
    import { derived, get } from "svelte/store";
    import socket from "@socket";
    import { onMount } from "svelte/internal";
    import EstopConfirm from "./EstopConfirm.svelte";
    
    export let station:1|2|3
    export let alliance:'red'|'blue'
    export const pos = `${alliance}${station}`
    export const dsposstring = (alliance == "red" ? "R":"B")+station as DriverStation
    const robot = derived([matchData[pos], teamList], ([$teamid, $teams]) => $teams[$teamid]?.displaynum?.get() ?? "0")
    const scoreBreakdown         = alliance== "red" ? matchData.redScoreBreakdown : matchData.blueScoreBreakdown
    const scoreBreakdownOpponent = alliance== "red" ? matchData.blueScoreBreakdown : matchData.redScoreBreakdown
    
    $: if ($scoreBreakdown == null) {$scoreBreakdown = {autoBunnyCount:0, autoTaxiBonus:[false,false,false], finalBunnyCount:0, targetHits:[0,0,0], endgameParkBonus:[false,false,false], fouls:[]}}
    $: if ($scoreBreakdownOpponent == null) {$scoreBreakdownOpponent = {autoBunnyCount:0, autoTaxiBonus:[false,false,false], finalBunnyCount:0, targetHits:[0,0,0], endgameParkBonus:[false,false,false], fouls:[]}}
    let lastHitTime:number = 0
    let undoStopwatchValue = "-"
    function registerHit() {
        lastHitTime = Date.now()
        socket.emit("registerHit", dsposstring)
    }
    
    function undoHit() {
        lastHitTime = 0
        socket.emit("undoHit", dsposstring)
    }
    function registerFoul(value:number) {
        scoreBreakdownOpponent.update((breakdown) => {breakdown.fouls.push({"robot": get(matchData[pos]), timestamp: Date.now(), value}); return breakdown})
    }
    async function estop() {
        const didConfirm = await estopconfirm.confirm()
        if (didConfirm) {
            socket.emit("estop", driverstations[pos])
        }
    }
    let estopconfirm: EstopConfirm
    setInterval(() => {
        const time = Math.round((Date.now() - lastHitTime)/1000)
        undoStopwatchValue = time > 15 ? "—" : time+"s"
    }, 500)


    
    let disableHitButton = false

    dsStatuses.subscribe((statuses) => {
        if (statuses == null) {return}
        const station  = statuses[dsposstring]
        disableHitButton = station.bypassed ? false : !station.robotConnected || station.isEstopped || !station.enabled;
    })
</script>

<div class="scoring-container" style="--buttoncolor:{alliance == "red" ? 'rgb(122, 0, 0)' : 'rgb(0, 45, 122)'}">
    <EstopConfirm bind:this={estopconfirm}>
        <span slot=robot>{$robot}</span>
    </EstopConfirm>
    <button style="grid-column:1/span 2; height:100%; background-color:var(--buttoncolor); font-size:25px;display:flex;align-items:center;justify-content:center;" on:click={() => window.location.pathname = "/scoring/"+prompt("What station are you")}>
        <span>{pos.toUpperCase()} - {$robot}</span>
    </button>
    <div style=font-size:40px;>
        <div style="width:100%;height:calc(50% - 10px);padding-bottom:10px;margin:0;">
            <button class="btn" style="height:100%; width:100%;margin:0;" on:click={() => registerFoul(5)}>5pt Foul</button>
        </div>
        <div style="width:100%;height:calc(50% - 10px);padding-top:10px;margin:0;">
            <button class="btn" style="height:100%; width:100%;margin:0;" on:click={() => registerFoul(10)}>10pt Foul</button>
        </div>
    </div>
    <div style=display:flex;justify-content:space-evenly;flex-direction:column>
        <span style=font-size:30px;>Bunnies</span>
        <div>
        <span style=font-size:20px;>Auto</span>
        <div class=bunnybuttons style=width:100%>
            <button class="red-button bunny-btn" on:click={() => $scoreBreakdown.autoBunnyCount--}>-</button>
            <input type="number" bind:value={$scoreBreakdown.autoBunnyCount} />
            <button class="green-button bunny-btn" on:click={() => $scoreBreakdown.autoBunnyCount++}>+</button>
        </div>
    </div>
    <div>
        <span style=font-size:20px;>Endgame</span>
        <div class=bunnybuttons style=width:100%>
            <button class="red-button bunny-btn" on:click={() => $scoreBreakdown.finalBunnyCount--}>-</button>
            <input type="number" bind:value={$scoreBreakdown.finalBunnyCount} />
            <button class="green-button bunny-btn" on:click={() => $scoreBreakdown.finalBunnyCount++}>+</button>
        </div>
    </div>
</div>
    <div>
        <button class="btn" style="width:100%;height:100%;;box-sizing:border-box;margin:0;font-size:60px;background-color:black;border:1px solid #a0a0a0" on:click={estop}>Estop</button>
    </div>
    <div class="hit-tracker">
        <button class="red-button btn" style="width:100%;height:70%;;box-sizing:border-box;margin:0;font-size:60px;" on:click={registerHit} disabled={disableHitButton}>Hit ({$scoreBreakdownOpponent.targetHits[station-1] ?? 0})</button>
        <div style="width:100%;height:calc(30% - 10px);padding-top:10px;margin:0;">
            <button class="btn" style="width:100%;height:100%;margin:0;font-size:40px;background-color:orange" on:click={undoHit}>Undo ({undoStopwatchValue})</button>
        </div>
    </div>
</div>

<style lang="scss">
    .scoring-container {
        display: grid;
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0;
        right: 0;
        padding: 5px;
        max-height: 100vh;
        gap:40px;
        overflow: hidden;
        grid-template-rows: 50px auto auto;
        grid-template-columns: auto auto;
        grid-auto-flow:row;
        > * {
            border: 1px white dashed;
        }
    }
    .btn {
        background-color:var(--buttoncolor,rgb(122,0,0));
    }
    .red-button {
        background-color: rgb(122, 0, 0);
    }
    .green-button {
        background-color: green;
    }
    .bunnybuttons > *{
        height:60px;
        font-size: 20px;
    }

    .bunny-btn {
        width:80px;
        text-align:center;
    }

</style>
