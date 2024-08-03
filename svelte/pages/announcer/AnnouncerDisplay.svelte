<script lang=ts>
    import matchData, {setPreloadingTrack} from "~/lib/store";
    import AnnouncerTeamsDisplay from "./AnnouncerTeamsDisplay.svelte";
    import AnnouncerScoresDisplay from "./AnnouncerScoresDisplay.svelte";
    import type {MatchState} from "~common/types";

    setPreloadingTrack(true)
    const {state, id} = matchData;
    const components:{[key in MatchState]:any} = {
        "pending": AnnouncerTeamsDisplay,
        "progress": AnnouncerTeamsDisplay,
        "completed": AnnouncerScoresDisplay,
        "posted": AnnouncerScoresDisplay,
    }
    $: activeComponent = components[$state];
</script>


<svelte:component this={activeComponent} />

<div id="matchNum">
    {$id.toUpperCase()}
</div>

<style>
 #matchNum {
     background-color: #575757;
     border-radius: 5px;
     padding:5px 10px;
     position: absolute;
     top:10px;
     left:10px;
     z-index: 100;
     font-family: Hack,serif;
 }
</style>