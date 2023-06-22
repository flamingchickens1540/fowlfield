<script lang="ts">
    import type {Readable} from "svelte/store";
    
    export let key:string;
    export let store:Readable<any>    
</script>


<div class=parent>
    <em>{key}</em>
    <input bind:value={$store}>
</div>


<style lang=scss>
    .parent {
        border: 1px solid rgb(115, 115, 115);
        padding-left:3px;
        &:not(:first-child) {
            border-top-width: 0px;
        }

        
        display:flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
</style>