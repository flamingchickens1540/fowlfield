<script lang="ts">
    import type { WritableTeamData } from "socketStore";
    import type { DriverStation } from "@fowltypes";
    import { dsStatuses, teamList } from "@store";
    import { derived, type Writable } from "svelte/store";
    import { roundToPlaces } from "@fowlutils/format";
    
    export let DSKey:DriverStation;
    
    export let teamID:Writable<number>
        const prettyTeamID = derived([teamID, teamList], ([$team, $teams]) => $teams[$team]?.displaynum.get())
        
        $: dsStatus = ($dsStatuses ?? {})[DSKey]
        
        export let  row:number
    </script>
    
    <div class=row style="--row:{row}">
        
        <div class="entry">{DSKey}</div>
        <div class="entry">{$teamID}</div>
        <div class="entry">{$prettyTeamID ?? ""}</div>
        <div class=entry > <div class="stateIndicator" data-value={dsStatus?.dsConnected}></div></div>
        <div class=entry><div class="stateIndicator" data-value={dsStatus?.radioConnected}></div></div>
        <div class=entry><div class="stateIndicator" data-value={dsStatus?.robotConnected}></div></div>
        <div class="entry">{roundToPlaces(dsStatus?.battery,1) ?? ""}</div>
        <div class=entry><span style="font-size:60px;">{dsStatus?.isEstopped ? "E" : dsStatus?.isAuto ? "A": "T"}</span><div class="stateIndicator" data-estop={dsStatus?.isEstopped} data-value={dsStatus?.enabled}></div></div>
        <div class="entry">{dsStatus?.tripTime ?? ""}</div>
        <div class="entry">{dsStatus?.missedPackets ?? ""}</div>
        <div class="overlay" style="--zindex:{dsStatus?.bypassed ? "15": "auto"}; --color:{dsStatus?.bypassed ? "#949494d6" : dsStatus?.robotConnected ? "#ffffff00" : "#FFFF01aa"}"></div>
    </div>
    
    <style lang=scss>
        @import "../monitor.scss";
        .entry span {
            z-index:10;
            
        }
        
        .entry {
            grid-row:var(--row);
            &:nth-child(1) {grid-column: 1;}
            &:nth-child(2) {grid-column: 2;}
            &:nth-child(3) {grid-column: 3;}
            &:nth-child(4) {grid-column: 4;}
            &:nth-child(5) {grid-column: 5;}
            &:nth-child(6) {grid-column: 6;}
            &:nth-child(7) {grid-column: 7;}
            &:nth-child(8) {grid-column: 8;}
            &:nth-child(9) {grid-column: 9;}
            &:nth-child(10) {grid-column: 10;}
        }
        .overlay {
            padding:1px;
            grid-row:var(--row);
            grid-column-start: 1;
            grid-column-end: 11;
            z-index: var(--zindex);
            background-color: var(--color);
        }
        .stateIndicator {
            position:absolute;
            top:10%;
            bottom:10%;
            left:10%;
            right:10%;
            background-color: #C0504E;
            border:5px solid   #943735;
            &[data-value=true] {
                background-color: #9BBB59;
                border:5px solid  #839758;
                border-radius: 50%;
            }
            
            &[data-estop=true] {
                background-color: #5f5f5f;
                border:5px solid  #000000;
                width: 65%;
                height: 65%;
                box-sizing: border-box;
                margin-left:8.5%;
                margin-top:6%;

                transform: rotate(-45deg);
            }
            
        }
    </style>