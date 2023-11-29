<script lang="ts">
	import { matchList, teamList } from "@store";
	import { MatchState } from "../../../../common/types/types";
	import type { Writable } from "svelte/store";
	import LeaderLine from "leader-line-new";
	import { calculateAlliancePoints } from "@fowlutils/scores";

    export let title:string
    export let id:string
    type LineData = {line:LeaderLine, startElement:HTMLElement, endElement:HTMLElement}
    export let lines:Writable<{[key:string]:[LineData,LineData]}>

    $: winline = $lines[id]?.[0]
    $: lossline = $lines[id]?.[1]
    $: match = $matchList[id]

    $: redscore  = calculateAlliancePoints(match?.redScoreBreakdown) 
    $: bluescore = calculateAlliancePoints(match?.blueScoreBreakdown)
    $: winner = match?.state != MatchState.POSTED || redscore == bluescore? "none" : redscore>bluescore? "red" : "blue" //TODO: check ties

    $: {
        if (winner == "red") {
            winline?.line?.setOptions({start: LeaderLine.pointAnchor(winline.startElement, {x:"100%", y:76})})
            lossline?.line?.setOptions({start: LeaderLine.pointAnchor(lossline.startElement, {x:"100%", y:109})})
        } else if (winner == "blue") {
            winline?.line?.setOptions({start: LeaderLine.pointAnchor(winline.startElement, {x:"100%", y:109})})
            lossline?.line?.setOptions({start: LeaderLine.pointAnchor(lossline.startElement, {x:"100%", y:76})})
            
        } else {

        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id={id} class=fullsize style="--redweight:{winner == "red" ? 700 : "unset"};--blueweight:{winner == "blue" ? 700 : "unset"}">
    <span class=title>{title}</span>
    <div class="red alliance">{match?.redAlliance ??""}</div>
    <div class="blue alliance">{match?.blueAlliance ??""}</div>
    <div class="red teams">
        <span>{$teamList[match?.red1]?.displaynum.get() ?? ""}</span>
        <span>{$teamList[match?.red2]?.displaynum.get() ?? ""}</span>
        <span>{$teamList[match?.red3]?.displaynum.get() ?? ""}</span>
    </div>
    <div class="blue teams">
        <span>{$teamList[match?.blue1]?.displaynum.get() ?? ""}</span>
        <span>{$teamList[match?.blue2]?.displaynum.get() ?? ""}</span>
        <span>{$teamList[match?.blue3]?.displaynum.get() ?? ""}</span>
    </div>
</div>

<style lang=scss>
    @mixin centered($content:center) {
        display:flex;
        justify-content: $content;
        align-items: center;
    }
    .title {
        grid-row:1;
        grid-column:1/span 2;
        font-size: 30px;
        @include centered();
    }



    .alliance {
        @include centered();
        grid-column:1;
        &.blue {background-color:rgb(68, 68, 198); border-bottom-left-radius: 5px;}
        &.red {background-color:rgb(209, 69, 69);}
    }

    .red {
        grid-row:2;
        font-weight:var(--redweight)
    }
    .blue {
        grid-row:3;
        font-weight:var(--blueweight)
    }

    .teams {
        @include centered(space-evenly);
        grid-column:2;
        &.blue {background-color:rgb(99, 99, 226);border-bottom-right-radius: 5px;}
        &.red {background-color:rgb(235, 96, 96);}

        span {
            width:100%;
        }
    }


    .fullsize {
        background-color: rgb(128, 128, 128);
        border-radius: 5px;
        width:100%;
        height:125px;
        display:grid;
        grid-template-columns: 20px auto;
        grid-template-rows:60px auto auto;
    }
</style>