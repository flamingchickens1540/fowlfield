<script context="module" lang="ts">
    export type LowZoneKeys = 'zone_bunnies' | 'zone_balloons_own' | 'zone_balloons_opp'
</script>

<script lang="ts">
    import matchData, { loadedMatch } from '~/lib/store'
    import { derived, writable } from 'svelte/store'
    import type { ToteKey } from '~common/types'
    import { getBlankTote } from '~common/utils/blanks'
    import SelectorButton from './components/SelectorButton.svelte'
    import InputComponent from './components/InputComponent.svelte'
    import type { Tote } from '@prisma/client'
    import socket from '~/lib/socket'
    import { onMount } from 'svelte'
    import LowZoneSelectorButton from '~/pages/scoring/components/LowZoneSelectorButton.svelte'
    import LowZoneInputComponent from '~/pages/scoring/components/LowZoneInputComponent.svelte'

    const { scores, state } = matchData
    const index = writable<string>('tote1')
    const blankTote = getBlankTote()
    $: isTote = $index in $scores.totes
    const isRed = derived(index, ($index) => $index == 'red')
    const tote = derived([scores, index], ([$scores, $index]) => $scores.totes[$index as ToteKey] ?? blankTote, blankTote)
    scores.setWritable()
    onMount(() => {
        const initialSize = window.visualViewport!.height
        window.visualViewport!.addEventListener('scroll', (e) => {
            if (window.visualViewport!.height == initialSize && window.scrollY != 0) {
                window.scrollTo(0, 0)
            }
        })
        document.addEventListener(
            'dblclick',
            function (event) {
                event.preventDefault()
            },
            { passive: false }
        )
    })
    const totes: { label: string; key: ToteKey }[] = []
    for (let i = 1; i <= 12; i++) {
        totes.push({ label: i.toString(), key: `tote${i as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}` })
    }

    // Avoid updating too quickly
    // const totetimeouts = new Map<string, number>()
    function updateTote(field: keyof Tote, value?: number) {
        const key = $index
        if (!(key in $scores.totes)) {
            return
        }
        if (field == 'bunnies' && value != null && value < 0) {
            value = 0
        }
        if (value != null) {
            // if (totetimeouts.has(key+field)) {
            //     clearTimeout(totetimeouts.get(key+field))
            // }
            // totetimeouts.set(key+field, setTimeout(() => {
            socket.emit('toteData', $loadedMatch, key as ToteKey, { [field]: value })
            // totetimeouts.delete(key+field)
            // }, 1000) as unknown as number)
        }
    }

    function updateLowZone(field: LowZoneKeys, value?: number) {
        const key = $index
        if (key in $scores.totes) {
            return
        }
        if (value != null && value < 0) {
            value = 0
        }
        if (value != null) {
            socket.emit('zoneData', $loadedMatch, key == 'red', { [field]: value })
        }
    }
</script>

<div class="btn-group">
    <LowZoneSelectorButton parentStore={index} isRed={true}></LowZoneSelectorButton>
    {#each totes as { key, label }, i}
        <SelectorButton {key} {label} parentStore={index}></SelectorButton>
    {/each}
    <LowZoneSelectorButton parentStore={index} isRed={false}></LowZoneSelectorButton>
</div>
<div class="parent">
    <div class="inputcontainer" style={`display:${isTote ? 'flex' : 'none'}`}>
        <InputComponent updateFunction={updateTote} {index} {tote} field="red_balloons"></InputComponent>
        <InputComponent updateFunction={updateTote} {index} {tote} field="blue_balloons"></InputComponent>
        <InputComponent updateFunction={updateTote} {index} {tote} field="bunnies"></InputComponent>
    </div>
    <div class="inputcontainer" style={`display:${isTote ? 'none' : 'flex'}`}>
        <LowZoneInputComponent updateFunction={updateLowZone} {isRed} field="zone_balloons_own"></LowZoneInputComponent>
        <LowZoneInputComponent updateFunction={updateLowZone} {isRed} field="zone_balloons_opp"></LowZoneInputComponent>
        <LowZoneInputComponent updateFunction={updateLowZone} {isRed} field="zone_bunnies"></LowZoneInputComponent>
    </div>
</div>

<style lang="scss">
    .parent {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .inputcontainer {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 40%;
    }

    :global(:root) {
        //touch-action: none;
        height: 100%;
        overscroll-behavior-y: none;
    }

    :global(body) {
        margin: 0 !important;
        padding: 0;
    }

    .btn-group {
        display: flex;
        flex-direction: row;
        gap: 0;
        justify-content: center;
        margin: 10px;
    }

    /* Clear floats (clearfix hack) */
    .btn-group:after {
        content: '';
        clear: both;
        display: table;
    }
</style>
