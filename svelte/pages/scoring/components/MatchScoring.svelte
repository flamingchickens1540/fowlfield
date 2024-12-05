<script lang="ts">
    import { derived, type Writable } from 'svelte/store'
    import type { Tote } from '@prisma/client'
    import socket from '~/lib/socket'
    import { loadedMatch } from '~/lib/store'
    import { safeParseInt } from '~common/utils'

    export let index:number
    export let tote:Writable<Tote>
    const redCount = derived(tote, (tote) => tote.red_balloons)
    const blueCount = derived(tote, (tote) => tote.blue_balloons)
    const bunnyCount = derived(tote, (tote) => tote.bunnies)
    redCount.subscribe((value) => {
        console.error(value)
    })

    function update(field: keyof Tote, value?: number) {
        if (value) {
            socket.emit('toteData', $loadedMatch, index, { [field]: value })
        }
    }
</script>

<div style="background-color: #ffaaaa">
    <input type="number" value={$redCount} on:change={(e) => update("red_balloons", safeParseInt(e.currentTarget.value))}>
    <input type="number" value={$blueCount} on:change={(e) => update("blue_balloons", safeParseInt(e.currentTarget.value))}>
    <input type="number" value={$bunnyCount} on:change={(e) => update("bunnies", safeParseInt(e.currentTarget.value))}>
</div>
<style lang="scss">

</style>
