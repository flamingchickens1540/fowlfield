<script lang="ts">
    import matchData from '~/lib/store'
    import StoreMonitor from '~/pages/test/components/StoreMonitor.svelte'
    import { createPropertyStore } from '~/lib/socketStore'
    import { getRandomizedAllianceScoreBreakdown } from '~common/utils/blanks'
    import { MatchState } from '~common/types'

    matchData.scores.setWritable()
    const redScores = createPropertyStore(matchData.scores, 'red')
    const blueScores = createPropertyStore(matchData.scores, 'blue')
</script>

<main>
    <div class="grid">
        <div class="col">
            <StoreMonitor label="ID" type="text" store={matchData.id} />
            <StoreMonitor label="Type" type="dropdown" options={['elimination', 'qualification']} store={matchData.type.setWritable()} />
            <StoreMonitor label="Stage Index" type="number" store={matchData.stage_index.setWritable()} />

            <StoreMonitor pad label="Start Time" type="number" store={matchData.startTime.setWritable()} />
            <StoreMonitor label="State" type="dropdown" options={Object.values(MatchState)} store={matchData.state.setWritable()} />
            <StoreMonitor label="Stage Index" type="number" store={matchData.stage_index.setWritable()} />

            <StoreMonitor pad label="blue1" type="number" store={matchData.blue1.setWritable()} />
            <StoreMonitor label="blue2" type="number" store={matchData.blue2.setWritable()} />
            <StoreMonitor label="blue3" type="number" store={matchData.blue3.setWritable()} />
            <StoreMonitor label="red1" type="number" store={matchData.red1.setWritable()} />
            <StoreMonitor label="red2" type="number" store={matchData.red2.setWritable()} />
            <StoreMonitor label="red3" type="number" store={matchData.red3.setWritable()} />

            <StoreMonitor label="cabbages_in_patch" type="checkbox" store={createPropertyStore(matchData.scores, 'cabbages_in_patch')} />

            <StoreMonitor pad label="Blue Score" type="number" store={matchData.blueScore} />
            <StoreMonitor label="Red Score" type="number" store={matchData.redScore} />
            <button
                on:click={() => {
                    matchData.scores.update((s) => {
                        s.blue = getRandomizedAllianceScoreBreakdown()
                        s.red = getRandomizedAllianceScoreBreakdown()
                        s.cabbages_in_patch = Math.random() > 0.7
                        return s
                    })
                }}>Randomize Scores</button>
        </div>
        {#each [{ scores: redScores, color: 'var(--bgred)' }, { scores: blueScores, color: 'var(--bgblue)' }] as { scores, color }}
            <div class="col" style="--bgcolor:{color}">
                <StoreMonitor label="Robot 1 Card" type="text" store={createPropertyStore(scores, 'card_robot1')} />
                <StoreMonitor label="Robot 2 Card" type="text" store={createPropertyStore(scores, 'card_robot2')} />
                <StoreMonitor label="Robot 3 Card" type="text" store={createPropertyStore(scores, 'card_robot3')} />
                <StoreMonitor label="Feeding Station (auto)" type="number" store={createPropertyStore(scores, 'feeding_station_auto')} />
                <StoreMonitor label="Feeding Station (tele)" type="number" store={createPropertyStore(scores, 'feeding_station_tele')} />
                <StoreMonitor label="Grass (auto)" type="number" store={createPropertyStore(scores, 'grass_auto')} />
                <StoreMonitor label="Grass (tele)" type="number" store={createPropertyStore(scores, 'grass_tele')} />
                <StoreMonitor label="Bunnies" type="number" store={createPropertyStore(scores, 'endgame_bunnies')} />
                <StoreMonitor label="Fouls" type="number" store={createPropertyStore(scores, 'foul_points')} />
                <StoreMonitor label="Park (1)" type="checkbox" store={createPropertyStore(scores, 'auto_park_robot1')} />
                <StoreMonitor label="Park (2)" type="checkbox" store={createPropertyStore(scores, 'auto_park_robot2')} />
                <StoreMonitor label="Park (3)" type="checkbox" store={createPropertyStore(scores, 'auto_park_robot3')} />
                <StoreMonitor label="Hits (1)" type="number" store={createPropertyStore(scores, 'hits_robot1')} />
                <StoreMonitor label="Hits (2)" type="number" store={createPropertyStore(scores, 'hits_robot2')} />
                <StoreMonitor label="Hits (3)" type="number" store={createPropertyStore(scores, 'hits_robot3')} />
            </div>
        {/each}
    </div>
</main>

<style lang="scss">
    main {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 60px;
    }

    :global(body) {
        margin: 0;
        overscroll-behavior: none;
    }

    .grid {
        width: 100%;
        height: 100%;
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fill, 400px);
        grid-template-rows: repeat(auto-fill, 60px);
        grid-auto-flow: row;
    }
</style>
