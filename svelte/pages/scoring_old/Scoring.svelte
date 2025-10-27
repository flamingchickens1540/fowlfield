<script context="module" lang="ts">
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    import matchData from '~/lib/store'
    import type { Writable } from 'svelte/store'
    import type { Tote } from '@prisma/client'
    import writableDerived from 'svelte-writable-derived'
    import EndScoring from './components/EndScoring.svelte'
    import AutoScoring from './components/AutoScoring.svelte'
    import type { ToteKey } from '~common/types'

    const { scores, state } = matchData
    const storesPromise = new Promise<{ key: ToteKey; tote: Writable<Tote> }[]>((resolve, reject) => {
        onMount(() => {
            const isSideB = window.location.search.includes('sideB')
            const isSideA = window.location.search.includes('sideA')
            document.getElementById('manifest')!.setAttribute('href', isSideB ? '/manifest/scoringB.webmanifest' : '/manifest/scoringA.webmanifest')

            document.addEventListener(
                'dblclick',
                function (event) {
                    event.preventDefault()
                },
                { passive: false }
            )

            const toteStores: { key: ToteKey; tote: Writable<Tote> }[] = []
            const init = isSideB ? 7 : 1
            const end = isSideA ? 6 : 12
            for (let i = init; i <= end; i++) {
                const key = `tote${i}` as ToteKey
                toteStores.push({
                    key,
                    tote: writableDerived(
                        scores,
                        ($scores) => $scores.totes[key],
                        (value, scores) => {
                            scores.totes[key] = value
                            return scores
                        }
                    )
                })
            }
            resolve(toteStores)
        })
    })
    scores.setWritable()
</script>

<div style={`display:${$state == 'ended' || $state == 'posted' ? 'block' : 'none'}`}>
    {#await storesPromise then toteStores}
        {#each toteStores as { key, tote }}
            <EndScoring {key} {tote} />
        {/each}
    {/await}
</div>
<div style={`display:${$state == 'not_started' || $state == 'in_progress' ? 'block' : 'none'}`}>
    {#await storesPromise then toteStores}
        {#each toteStores as { key, tote }}
            <AutoScoring {key} {tote} />
        {/each}
    {/await}
</div>

<style lang="scss">
    :global(:root) {
        //touch-action: none;
        height: 100%;
        overscroll-behavior-y: none;
    }

    :global(body) {
        margin: 0 !important;
        padding: 0;
    }
</style>
