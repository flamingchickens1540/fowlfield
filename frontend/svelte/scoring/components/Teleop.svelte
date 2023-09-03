<script lang="ts">
    import { writable } from "svelte/store";

    let bunnies = writable(0);
</script>

<div class="bunnies">
    <span class="bunnyHeader">Teleop Bunnies</span>
    <input type="number" bind:value={$bunnies}>
</div>