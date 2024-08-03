<script lang=ts>
    export let trueColor:string="hsl(120, 100%, 20%)"
    export let falseColor:string="hsl(0, 100%, 20%)"
    export let isTrue:boolean
    export let constantText:boolean = false
</script>

<div class="indicator" style="background-color:{isTrue ? trueColor : falseColor}">
    {#if constantText}
    <slot>TEXT</slot>
    {:else}
        {#if isTrue}
        <slot name=true>TRUE</slot>
        {:else}
        <slot name=false>FALSE</slot>
        {/if}
    {/if}
</div>


<style>
    .indicator {
        display:flex;
        justify-content: center;
        align-items:center;
    }
</style>