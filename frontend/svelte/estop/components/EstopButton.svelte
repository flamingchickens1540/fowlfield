<script lang="ts">
	import matchData, { teamList } from "@store";
	import { derived } from "svelte/store";

    export let pos:`${"red"|"blue"}${1|2|3}`

    let isPressed:boolean = false

    const store = derived([matchData[pos], teamList], ([$teamid, $teams]) => $teams[$teamid]?.displaynum?.get() ?? "0")

    const onclick = () => {
        isPressed = true
        console.log("pressed")
        element.style.backgroundColor = "#000000c5"
    };

    let element:HTMLDivElement

    
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={onclick} bind:this={element} class="noselect estop-button">
    {$store}
</div>

<style>
    .estop-button {
        width:100%;
        height:100%;
        display:flex;
        justify-content: center;
        align-items: center;
        font-size:20vh;

        &.pressed {
            background-color: #000000c5;
        }
    }

    .noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>