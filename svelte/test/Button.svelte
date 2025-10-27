<script lang="ts">
    export let key: string
    export let onclick: () => void
</script>

<div class="parent">
    <div class="inputstyle" on:click={onclick}>{key}</div>
</div>

<style lang="scss">
    .inputstyle {
        background-color: rgb(59, 59, 59);
        border-color: rgb(133, 133, 133);
        border-width: 1px;
        border-style: solid;
        display: block;
        width: 100%;
    }
    .parent {
        border: 1px solid rgb(115, 115, 115);
        &:not(:first-child) {
            border-top-width: 0;
        }

        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
</style>
