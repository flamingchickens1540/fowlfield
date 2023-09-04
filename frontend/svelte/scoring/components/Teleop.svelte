<script lang="ts">
    import { writable } from "svelte/store";

    export let alliance: "red" | "blue";

    let bunnies = writable(0);
    let penalty = writable(0);
</script>

<div class="bunnies">
    <span class="bunnyHeader">Teleop Bunnies</span>
    <button on:click={() => $bunnies--}>-</button>
    <input type="number" bind:value={$bunnies}>
    <button on:click={() => $bunnies++}>+</button>
</div>

<div class="penalties">
    <span class="penaltiesHeader">Penalties</span>
    <button on:click={() => $bunnies--}>-</button>
    <input type="number" bind:value={$penalty}>
    <button on:click={() => $bunnies++}>+</button>
</div>
