<script lang=ts>
    import matchData from "@store";
	import AnnouncerTeamsDisplay from "./AnnouncerTeamsDisplay.svelte";
    import AnnouncerScoresDisplay from "./AnnouncerScoresDisplay.svelte";
	import type { MatchState } from "@fowltypes";
	
    const {state} = matchData;
    const components:{[key in MatchState]:any} = {
        "pending": AnnouncerTeamsDisplay,
        "progress": AnnouncerTeamsDisplay,
        "completed": AnnouncerScoresDisplay,
        "posted": AnnouncerScoresDisplay,
    }
    $: activeComponent = components[$state];
</script>


<svelte:component this={activeComponent} />