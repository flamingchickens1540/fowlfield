<script lang="ts">
    import matchData, { elapsedTimeInPeriod, matchPeriod, matchTime, remainingTimeInPeriod } from '~/lib/store'
    import StoreView from './Store.svelte'
    import Button from './Button.svelte'
    import configureAudio from '~//lib/audio'
    import ScoreStore from './ScoreStore.svelte'
    import BucketPanel from './BucketPanel.svelte'

    configureAudio()
</script>

<h1>Test Page</h1>
<div class="horizontalflow">
    <div class="section">
        <h2>Match Data</h2>
        <div>
            {#each Object.entries(matchData) as [key, value]}
                <StoreView {key} store={value}></StoreView>
            {/each}
            <ScoreStore key="redScoreBreakdown" store={matchData.redScoreBreakdown}></ScoreStore>
            <ScoreStore key="blueScoreBreakdown" store={matchData.blueScoreBreakdown}></ScoreStore>
        </div>
    </div>
    <div class="section">
        <h2>Match State</h2>
        <div>
            <StoreView key="MatchState" store={matchPeriod}></StoreView>
            <StoreView key="Elapsed Match" store={matchTime}></StoreView>
            <StoreView key="Remaining Period" store={remainingTimeInPeriod}></StoreView>
            <StoreView key="Elapsed Period" store={elapsedTimeInPeriod}></StoreView>
            <Button
                key="Reset"
                onclick={() => {
                    matchData.startTime.set(Date.now())
                }}
            ></Button>
        </div>
    </div>

    <div class="section">
        <h2>Bucket State</h2>
        <BucketPanel></BucketPanel>
    </div>
</div>

<style lang="scss">
    .horizontalflow {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-evenly;
    }
    .section {
        width: 400px;
        margin: 10px;
    }
</style>
