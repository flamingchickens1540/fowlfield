<script lang="ts">
    import Teleop from "./components/Teleop.svelte";
    import Hybrid from "./components/Hybrid.svelte";

    import { matchPeriod } from "@store";

</script>

<!--  -->
<div class="grid-container">
    {#if $matchPeriod == "teleop"}
        <Teleop alliance="red"/>
        <Teleop alliance="blue"/>
    {:else if $matchPeriod == "auto"}
        <Hybrid alliance="red"/>
        <Hybrid alliance="blue"/>
    {:else}
        <p>Scoring will be avaliable once the match starts</p>
    {/if}
</div>

<style lang="scss">

</style>