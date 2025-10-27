<script lang="ts">
    import { type Writable } from 'svelte/store'
    import type { Tote } from '@prisma/client'
    import socket from '~/lib/socket'
    import { loadedMatch } from '~/lib/store'
    import InputComponent from '~/pages/scoring/components/InputComponent.svelte'
    import type { ToteKey } from '~common/types'

    export let key: ToteKey
    export let tote: Writable<Tote>

    function update(field: keyof Tote, value?: number) {
        if (value != null) {
            socket.emit('toteData', $loadedMatch, key, { [field]: value })
        }
    }
</script>

<div class="container">
    <div class="title"><span>{key.replace('tote', '')}</span></div>
    <div class="inputcontainer">
        <InputComponent updateFunction={update} field="red_balloons" {tote}></InputComponent>
        <InputComponent updateFunction={update} field="blue_balloons" {tote}></InputComponent>
        <InputComponent updateFunction={update} field="bunnies" {tote}></InputComponent>
    </div>
</div>

<style lang="scss">
    .title {
        font-size: 2rem;
        margin: 0.5rem;
        flex-grow: 1;
        vertical-align: middle;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 1rem;
        padding: 0.5rem;
        border: 2px black solid;
        border-radius: 10px;
        background-color: #606060;
        &:nth-child(3n) {
            margin-bottom: 3rem;
        }
    }
    .inputcontainer {
        justify-content: right;
        display: flex;
        flex-direction: row;
        margin: 0.5rem;
        max-width: 100%;
        min-width: 0;
    }
</style>
