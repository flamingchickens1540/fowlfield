<script lang=ts>
    import matchData, { remainingTimeInDisplayPeriod, setPreloadingTrack } from '~/lib/store'
    import AnnouncerTeamsDisplay from './AnnouncerTeamsDisplay.svelte'
    import AnnouncerScoresDisplay from './AnnouncerScoresDisplay.svelte'
    import type { MatchState } from '~common/types'

    setPreloadingTrack(true)
    const {state, id} = matchData;
    const components:{[key in MatchState]:any} = {
        "not_started": AnnouncerTeamsDisplay,
        "in_progress": AnnouncerTeamsDisplay,
        "ended": AnnouncerScoresDisplay,
        "posted": AnnouncerScoresDisplay,
    }
    $: activeComponent = components[$state];
</script>


<svelte:component this={activeComponent} />

<div id="matchNum">
    {$id.toUpperCase()}
</div>

<div id="matchTime">
    {Math.max(Math.floor($remainingTimeInDisplayPeriod), 0)}
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
 #matchTime {
     background-color: #575757;
     border-radius: 5px;
     font-size: 5em;
     padding:40px;
     width:3em;
     position: absolute;
     top:30px;
     left:50%;
     transform:translate(-50%);
     z-index: 100;
     font-family: Hack,serif;
 }
</style>