<script lang="ts">
	import { getPrettyTeamStore } from "socketStore";
	import { onMount } from "svelte";
    // TODO:Implement estops
    export let pos:`${"red"|"blue"}${1|2|3}`


    const store = getPrettyTeamStore(pos)

    const onclick = () => {
        console.log("pressed")
        element.style.backgroundColor = "#000000c5"
    };

    let element:HTMLDivElement

    onMount(() => {
        element.addEventListener("click", onclick)
        element.addEventListener("tap", onclick)
    })
    
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={element} class="noselect estop-button">
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