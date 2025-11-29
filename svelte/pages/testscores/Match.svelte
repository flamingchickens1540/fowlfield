<script lang="ts">
    import matchData from '~/lib/store'
    import StoreMonitor from '~/pages/test/components/StoreMonitor.svelte'
    import { createPropertyStore, createSecondOrderSocketPropertyStore } from '~/lib/socketStore'

    matchData.scores.setWritable()
    const alliances = [{ alliance:"red", color: 'var(--bgred)' }, { alliance:"blue", color: 'var(--bgblue)' }] as const
</script>

<main>
    <div class="grid">
        {#each alliances as { alliance, color }}
            <div class="col" style="--bgcolor:{color}">
                <StoreMonitor label="Robot 1 Card" type="text" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, 'card_robot1')} />
                <StoreMonitor label="Robot 2 Card" type="text" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, 'card_robot2')} />
                <StoreMonitor label="Robot 3 Card" type="text" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, 'card_robot3')} />
                <StoreMonitor label="Feeding Station (auto)" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "feeding_station_auto")} />
                <StoreMonitor label="Feeding Station (tele)" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "feeding_station_tele")} />
                <StoreMonitor label="Grass (auto)" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "grass_auto")} />
                <StoreMonitor label="Grass (tele)" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "grass_tele")} />
                <StoreMonitor label="Bunnies" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "endgame_bunnies")} />
                <StoreMonitor label="Fouls" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "foul_points")} />
                <StoreMonitor label="Park (1)" type="checkbox" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "auto_park_robot1")} />
                <StoreMonitor label="Park (2)" type="checkbox" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "auto_park_robot2")} />
                <StoreMonitor label="Park (3)" type="checkbox" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "auto_park_robot3")} />
                <StoreMonitor label="Hits (1)" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "hits_robot1")} />
                <StoreMonitor label="Hits (2)" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "hits_robot2")} />
                <StoreMonitor label="Hits (3)" type="number" store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, "hits_robot3")} />
                
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
