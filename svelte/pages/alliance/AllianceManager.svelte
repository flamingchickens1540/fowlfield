<script lang="ts">
    import AllianceItem from './components/AllianceItem.svelte'
    import socket, { awaitLoaded } from '~//lib/socket'
    import { teamList } from '~/lib/store'
</script>

<datalist id="teams">
    {#each Object.values($teamList) as team}
        <option value={team.display_number.get()}></option>
    {/each}
</datalist>

<h1>Alliance Selection</h1>
<div id="alliance-display">
    <div id="header">
        <div>Alliance</div>
        <div>Captain</div>
        <div>1st Pick</div>
        <div>2nd Pick</div>
        <div>3rd Pick</div>
    </div>
    {#await awaitLoaded() then _}
        <AllianceItem seed={1}></AllianceItem>
        <AllianceItem seed={2}></AllianceItem>
        <AllianceItem seed={3}></AllianceItem>
        <AllianceItem seed={4}></AllianceItem>
    {/await}
</div>

<button
    on:click={() => {
        socket.emit('commitAlliances', (success) => {
            console.log(success)
        })
    }}>Publish to TBA</button
>

<style lang="scss">
    button {
        margin-top: 80px;
        background-color: #4555a5;
        margin-bottom: 20px;
        font-size: 30px;
        padding: 20px;
    }
    #alliance-display {
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: 200px auto auto auto auto;
        grid-gap: 1em;
        #header {
            display: contents;
            font-size: 30px;
            > * {
                margin-top: 20px;
                margin-bottom: 20px;
            }
        }
    }
</style>
