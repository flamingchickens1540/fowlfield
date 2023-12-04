<script lang=ts>
    import {dsStatuses} from "@store"
	import Indicator from "./Indicator.svelte";
    
    let dsStatus
    $: {
        const statuses = Object.values($dsStatuses ?? {})
        dsStatus = {
            hardwareEstopOnline:  statuses.map((status) => status.hardwareEstopOnline).every((v)=>v),
            hardwareEstopPressed: statuses.map((status) => status.hardwareEstopPressed).some((v)=>v),
            estopActive:          statuses.map((status) => status.estopActive).some((v)=>v),
            dsConnected:          statuses.map((status) => status.bypassed || status.dsConnected).every((v)=>v),
            robotConnected:       statuses.map((status) => status.bypassed || status.robotConnected).every((v)=>v),
    }
    }
    const trueColor = "hsl(120, 100%, 10%)"
    const falseColor = "hsl(0, 100%, 10%)"
</script>

<div class=row>
    <div class=center>Station</div>
    <div class=center>Team</div>
    <Indicator {trueColor} {falseColor} constantText={true}  isTrue={dsStatus?.dsConnected}>
        DS
    </Indicator>
    <Indicator {trueColor} {falseColor}  constantText={true}  isTrue={dsStatus?.robotConnected}>
        RIO
    </Indicator>
    <Indicator {trueColor} {falseColor} constantText={true} isTrue={dsStatus?.hardwareEstopOnline}>
        Estop Online
    </Indicator>
    <Indicator {trueColor} {falseColor} constantText={true} isTrue={!dsStatus?.hardwareEstopPressed}>
        Estop Pressed
    </Indicator>
    <Indicator {trueColor} {falseColor} constantText={true} isTrue={!dsStatus?.estopActive}>
        Estop Active
    </Indicator>
    
</div>

<style>
    .center {
        display:flex;
        justify-content: center;
        align-items:center;
    }
    .row {
        display:contents;
        &:nth-child(1) > * {grid-row: 1;}
        &:nth-child(2) > * {grid-row: 2;}
        &:nth-child(3) > * {grid-row: 3;}
        &:nth-child(4) > * {grid-row: 4;}
        &:nth-child(5) > * {grid-row: 5;}
        &:nth-child(6) > * {grid-row: 6;}
        &:nth-child(7) > * {grid-row: 7;}
        
        &> * {
            width:100%;
            border-top: 1px white solid;
            border-right: 1px white solid;
            border-bottom: 1px white solid;
        }
    }
</style>