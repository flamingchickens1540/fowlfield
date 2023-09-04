<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { isMatchLoaded } from "@store";
    import matchData from "@store";
    

    let hybridBunnies: Writable<number> = writable(0);
    let hybridRobots: Writable<number> = writable(0);

    export let alliance: "red" | "blue";

    if (isMatchLoaded("")) {
        
    }
    
</script>

<div class="grid-container">
    <div class="alliance-header">
        <span class="alliance-header-text">{alliance} {$hybridBunnies - $hybridRobots}</span>
    </div>
    
    <div class="hybrid-bunnies">
        <span class="input-header">Hybrid Bunnies</span>
        <button on:click={() => $hybridBunnies--}>-</button>
        <input class="number-input" type="number" bind:value={$hybridBunnies} />
        <button on:click={() => $hybridBunnies--}>-</button>
    </div>
    
    <div class="hybrid-robots">
        <span class="input-header">Hybrid Robots(In home and loading zones)</span>
        <button on:click={() => $hybridRobots--}>-</button>
        <input class="number-input" type="number" bind:value={$hybridRobots}/>
        <button on:click={() => $hybridRobots--}>-</button>
    </div>
</div>

<style lang="scss">
    .grid-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 10px;
        height: 100%;
        width: 100%;
    }
</style>