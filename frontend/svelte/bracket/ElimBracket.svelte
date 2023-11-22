<script lang=ts>
	import { onMount } from "svelte";
    import Match from "./components/BracketMatch.svelte";
    import LeaderLine from 'leader-line-new';
	import { type Writable, writable } from "svelte/store";


    function drawLine(a, b, dash:boolean=false, start:LeaderLine.SocketType="right"):LineData {
        const startElement = document.getElementById(a);
        const endElement = document.getElementById(b);
        const line = new LeaderLine(
            LeaderLine.pointAnchor(startElement, {x:"100%", y:dash?40: 20}), 
            LeaderLine.pointAnchor(endElement, {x:0, y:30}), 
            {
                path:"grid",
                startSocket:"right",
                endSocket:"left",
                color:"#d6d6d6",
                // startSocketGravity:dash?[300,0]:[0,0],
                dash
            }
        )
        return {line, startElement, endElement}
    }

    function createLines(start:string, win:string, lose:string=null) {
        lines.update((data) => {
            data[start] ??= [null, null]
            data[start][0] = drawLine(start, win, false)
            if (lose != null) {
                data[start][1] = drawLine(start, lose, true)
            }
            return data
        })
        
    }
    type LineData = {line:LeaderLine, startElement:HTMLElement, endElement:HTMLElement}
    let lines:Writable<{[key:string]:[LineData,LineData]}> =writable({})
    onMount(() => {
        createLines("sf1m1", "sf3m1", "sf4m1")
        createLines("sf2m1", "sf3m1", "sf4m1")
        createLines("sf4m1", "sf5m1")
        createLines("sf3m1", "f1m1", "sf5m1")
        createLines("sf5m1", "f1m1")
    })

</script>
<div class=estop-container>
    
        <div class=matchcontainer id="container-sf1m1"><Match {lines} title="Match 1" id=sf1m1></Match></div>
        <div class=matchcontainer id="container-sf2m1"><Match {lines} title="Match 2" id=sf2m1></Match></div>
        <div class=matchcontainer id="container-sf4m1"><Match {lines} title="Match 4" id=sf4m1></Match></div>
        <div class=matchcontainer id="container-sf3m1"><Match {lines} title="Match 3" id=sf3m1></Match></div>
        <div class=matchcontainer id="container-sf5m1"><Match {lines} title="Match 5" id=sf5m1></Match></div>
        <div class=matchcontainer id="container-f1m1"> <Match {lines} title="Finals" id=f1m1></Match></div>
    
</div>


<style lang="scss">
    .matchcontainer {
        display:flex;
        justify-content:center;
        align-items:center;
    }
    :global(:root) {
        touch-action: none;
        height: 100%;
        overscroll-behavior-y: none;
    }
    :global(body) {
        margin:0 !important;
        padding:0;
    }
    #container-sf1m1 {
        grid-column: 1;
        grid-row:1/span 2;
    }   
    #container-sf2m1 {
        grid-column: 1;
        grid-row:5/span 2;
    }   
    #container-sf4m1 {
        grid-column: 2;
        grid-row:10/span 2;
    }   
    #container-sf3m1 {
        grid-column: 3;
        grid-row:3 / span 2;
    }   
    #container-sf5m1 {
        grid-column: 3;
        grid-row:9 / span 2;
    }   
    #container-f1m1 {
        grid-column: 4;
        grid-row:6/span 2;
    }   
    .estop-container {
        position:absolute;
        padding:10px;

        left:0;
        right:0;

        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);

        display:grid;
        grid-template-columns: repeat(4, calc((100% - 240px)/4));
        column-gap: 80px;
        row-gap:-40px;
        grid-template-rows: repeat(11, calc(125px/2));
    }
    
</style>