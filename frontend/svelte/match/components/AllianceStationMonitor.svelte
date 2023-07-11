<script lang=ts>
	import type { DriverStation } from "@fowltypes";
    import {dsStatuses} from "@store"
	import Indicator from "./Indicator.svelte";
    export let station:DriverStation
    
    $: dsStatus = ($dsStatuses ?? {})[station]
</script>

<div class=row>
    <div class=center>{station}</div>
    
    {#if !(dsStatus?.bypassed ?? false)}
    <div class=center>{dsStatus?.assignedTeam}</div>
    <Indicator isTrue={dsStatus?.dsConnected}>
        <span slot=true>Online</span>
        <span slot=false>Offline</span>
    </Indicator>
    <Indicator isTrue={dsStatus?.robotConnected}>
        <span slot=true>Online</span>
        <span slot=false>Offline</span>
    </Indicator>
    {:else}
    <div class=center style="grid-column:auto/span 3">Bypassed</div>
    {/if}
    
    <Indicator isTrue={dsStatus?.hardwareEstopOnline}>
        <span slot=true>Online</span>
        <span slot=false>Offline</span>
    </Indicator>
    <Indicator isTrue={!dsStatus?.hardwareEstopPressed}>
        <span slot=true>Ready</span>
        <span slot=false>Pressed</span>
    </Indicator>
    <Indicator isTrue={!dsStatus?.estopActive}>
        <span slot=true>Inactive</span>
        <span slot=false>Active</span>
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