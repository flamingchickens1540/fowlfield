<script lang="ts">
    import matchData from "../store"
  import StoreView from "./Store.svelte";
</script>

<h1>Stores Test Page</h1>
<div class=parent>
{#each Object.entries(matchData) as [key, value]}
    <StoreView {key} store={value}></StoreView>
{/each}
</div>


<style>
    .parent {
        max-width: 300px;
        margin-left:auto;
        margin-right: auto;
    }
</style>