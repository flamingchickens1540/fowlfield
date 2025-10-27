<script lang="ts">
    import matchData from '~/lib/store'
    import StoreMonitor from '~/pages/test/components/StoreMonitor.svelte'
    import { createPropertyStore } from '~/lib/socketStore'

    matchData.scores.setWritable()
    const redScores = createPropertyStore(matchData.scores, 'red')
    const blueScores = createPropertyStore(matchData.scores, 'blue')
</script>

<main>
    <div class="grid">
        <div class="col">
            <StoreMonitor label="ID" type="text" store={matchData.id} />
            <StoreMonitor label="Type" type="text" store={matchData.type.setWritable()} />
            <StoreMonitor label="Stage Index" type="number" store={matchData.stage_index.setWritable()} />

            <StoreMonitor pad label="Start Time" type="number" store={matchData.startTime.setWritable()} />
            <StoreMonitor label="State" type="text" store={matchData.state.setWritable()} />
            <StoreMonitor label="Stage Index" type="number" store={matchData.stage_index.setWritable()} />

            <StoreMonitor pad label="blue1" type="number" store={matchData.blue1.setWritable()} />
            <StoreMonitor label="blue2" type="number" store={matchData.blue2.setWritable()} />
            <StoreMonitor label="blue3" type="number" store={matchData.blue3.setWritable()} />
            <StoreMonitor label="red1" type="number" store={matchData.red1.setWritable()} />
            <StoreMonitor label="red2" type="number" store={matchData.red2.setWritable()} />
            <StoreMonitor label="red3" type="number" store={matchData.red3.setWritable()} />

            <StoreMonitor label="corral_empty" type="checkbox" store={createPropertyStore(matchData.scores, 'corral_empty')} />

            <StoreMonitor pad label="Blue Score" type="number" store={matchData.blueScore} />
            <StoreMonitor label="Red Score" type="number" store={matchData.redScore} />
        </div>
        {#each [{ scores: redScores, color: 'var(--bgred)' }, { scores: blueScores, color: 'var(--bgblue)' }] as { scores, color }}
            <div class="col" style="--bgcolor:{color}">
                <StoreMonitor label="Robot 1 Card" type="text" store={createPropertyStore(scores, 'card_robot1')} />
                <StoreMonitor label="Robot 2 Card" type="text" store={createPropertyStore(scores, 'card_robot2')} />
                <StoreMonitor label="Robot 3 Card" type="text" store={createPropertyStore(scores, 'card_robot3')} />
                <StoreMonitor label="Zone Balloons" type="number" store={createPropertyStore(scores, 'zone_balloons')} />
                <StoreMonitor label="Zone Bunnies" type="number" store={createPropertyStore(scores, 'zone_bunnies')} />
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
