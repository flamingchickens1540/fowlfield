<script lang="ts">
    import matchData, {eventData} from "@store";
    import Match from "./components/Match.svelte";
    import Message from "./components/Message.svelte";
    import Results from "./components/QualsResults.svelte";
    import PlayoffResults from "./components/PlayoffResults.svelte";
    import {derived} from "svelte/store";
    import {MatchState} from "@fowltypes";
    import AllianceDisplay from "./components/AllianceDisplay.svelte";


    const isAlliance = window.location.pathname.endsWith("alliance")
    const shown = derived([matchData.type, matchData.state, eventData], ([$type, $state, {atLunch}]) => {
        if (atLunch) {
            return "msg"
        } else {
            if ($state == MatchState.POSTED) {
                return $type == "elimination" ? "playoffResults" : "results"
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
{/if}