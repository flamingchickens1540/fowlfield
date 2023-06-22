<script lang="ts">
    import matchData from "@store"
    import StoreView from "./Store.svelte";
</script>

<h1>Stores Test Page</h1>
<div class=horizontalflow>
    
    
    <div id=matchStores>
        <h2>Match</h2>
        <div>
            {#each Object.entries(matchData) as [key, value]}
            <StoreView {key} store={value}></StoreView>
            {/each}
        </div>
    </div>
    <div id=matchStores>
        <h2>Teams</h2>
        <div>
            <!-- {#each Object.entries(matchData) as [key, value]}
            <StoreView {key} store={value}></StoreView>
            {/each} -->
        </div>
    </div>
</div>


<style lang=scss>
    .horizontalflow {
        display: flex;
        flex-flow:row nowrap;
        justify-content:space-evenly;
    }
    #matchStores {
        width: 300px;
        margin: 10px;
    }
</style>