<script lang="ts">
  import { Readable } from "svelte/store";
    export let key:string;
    export let store:Readable<any>    
</script>


<div class=parent>
    <em>{key}</em>
    <input bind:value={$store}>
</div>


<style>
    .parent {
        display:flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
</style>