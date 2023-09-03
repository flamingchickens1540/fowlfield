<script lang="ts">
    import { writable } from "svelte/store";

    let hybridBunnies = writable(0);
    let hybridRobots = writable(0);
    
</script>

<div class="hybrid-bunnies">
    <span class="input-header">Hybrid Bunnies</span>
    <input class="number-input" type="number" bind:value={$hybridBunnies} />
</div>

<div class="hybrid-robots">
    <span class="input-header">Hybrid Robots(In home and loading zones)</span>
    <input class="number-input" type="number" bind:value={$hybridRobots}/>
</div>