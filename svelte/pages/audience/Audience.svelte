<script lang="ts">
    import matchData, { eventData } from '~/lib/store'
    import Match from './views/Match.svelte'
    import Message from './views/Message.svelte'
    import Results from './views/QualsResults.svelte'
    import PlayoffResults from './views/PlayoffResults.svelte'
    import { derived } from 'svelte/store'
    import { MatchState } from '~common/types'
    import AllianceDisplay from './views/AllianceDisplay.svelte'
    import Blank from './views/Blank.svelte'


    const isAlliance = window.location.search.includes("alliance")
    const shown = derived([matchData.type, matchData.state, eventData.atLunch], ([$type, $state, $atLunch]) => {
        if ($atLunch) {
            return "msg"
        } else {
            if ($state == MatchState.POSTED) {
                return $type == "elimination" ? "playoffResults" : "results"
            } else if ($state == MatchState.COMPLETE) {
                return "blank"
            } else {
                return "match"
            }
        }
    });
</script>

{#if isAlliance}
    <AllianceDisplay></AllianceDisplay>
{:else}
    <div style="display:{$shown === 'msg' ? 'contents': 'none'}">
        <Message></Message>
    </div>

    <div style="display:{$shown === 'results' ? 'contents': 'none'}">
        <Results></Results>
    </div>

    <div style="display:{$shown === 'playoffResults' ? 'contents': 'none'}">
        <PlayoffResults></PlayoffResults>
    </div>

    <div style="display:{$shown === 'match' ? 'contents': 'none'}">
        <Match></Match>
    </div>

    <div style="display:{$shown === 'blank' ? 'contents': 'none'}">
        <Blank></Blank>
    </div>
{/if}
