<script>
    import ScoreSummary from "../../lib/components/ScoreSummary.svelte";
    import matchData from "~/lib/store"
    import {MatchState} from "~common/types/index.js";

    const {state} = matchData
</script>

<main>
    <ScoreSummary></ScoreSummary>

    <div class=stateindicator style="background-color: {$state == MatchState.POSTED ? '#408f54' : '#8f7d40'}">
        {$state == MatchState.POSTED ? 'Posted' : 'Unpublished'}
    </div>
</main>


<style>
    .stateindicator {
        padding: 10px;
        margin: 20px;
        width: 300px;
        border-radius: 10px;
        font-size: 25px;
    }

    main {
        height:100%;;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>