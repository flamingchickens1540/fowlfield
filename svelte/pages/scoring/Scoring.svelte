<script context=module lang=ts>

</script>
<script lang=ts>
    import { onMount } from 'svelte'
    import matchData from "~/lib/store"
    import type { Writable } from 'svelte/store'
    import type { Tote } from '@prisma/client'
    import writableDerived from 'svelte-writable-derived'
    import MatchScoring from '~/pages/scoring/components/MatchScoring.svelte'
    const {scores} = matchData
    onMount(() => {
        document.addEventListener('dblclick', function (event) {
            event.preventDefault();
        }, {passive: false});
    })
    scores.setWritable()
    const toteStores:Writable<Tote>[] = []
    for (let i = 0; i < 4; i++) {
        toteStores.push(writableDerived(scores, ($scores) => $scores.totes[i], (value, scores) => {scores.totes[i] = value; return scores}))
    }
</script>

<MatchScoring index={0} tote={toteStores[0]}/>


<style lang=scss>
    :global(:root) {
        touch-action: none;
        height: 100%;
        overscroll-behavior-y: none;
    }

    :global(body) {
        margin: 0 !important;
        padding: 0;
    }
</style>