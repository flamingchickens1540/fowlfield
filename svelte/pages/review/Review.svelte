<script lang="ts">
    import matchData from '~/lib/store'
    import Card from './components/Card.svelte'
    import { createPropertyStore, createSecondOrderPropertyStore } from '~/lib/socketStore'
    import Field from '~/pages/review/components/Field.svelte'
    import FieldCheckbox from '~/pages/review/components/FieldCheckbox.svelte'
    import { titleCaseWord } from '~common/utils/format'
    import StationSuffixedField from './components/FieldNumberRobot.svelte'
    import FieldCheckboxRobot from './components/FieldCheckboxRobot.svelte'

    const { redScore, blueScore, scores, id, red1, red2, red3, blue1, blue2, blue3 } = matchData
    scores.setWritable()
    const metCoopertition = createPropertyStore(scores, 'cabbages_in_patch')
    const redFouls = createSecondOrderPropertyStore(scores, 'red', 'foul_points')
    const blueFouls = createSecondOrderPropertyStore(scores, 'blue', 'foul_points')
    const alliances = ['red', 'blue'] as const
</script>

<main>
    <h1>Match Review - {$id}</h1>
    <div>
        <FieldCheckbox label="Cabbages in Patch?" store={metCoopertition}></FieldCheckbox>
    </div>
    <div class="reviewcontainer">
        <div>
            <h2>Red Points - {$redScore}</h2>
        </div>
        <div>
            <h2>Blue Points - {$blueScore}</h2>
        </div>
    </div>
    <div class="reviewcontainer">
        {#each alliances as alliance}
            <div>
                <h2>{titleCaseWord(alliance)} Auto</h2>
                <Field label="Grass Carrots" store={createSecondOrderPropertyStore(scores, alliance, 'grass_auto')}></Field>
                <Field label="FS Carrots" store={createSecondOrderPropertyStore(scores, alliance, 'feeding_station_auto')}></Field>
                <FieldCheckboxRobot label="Park 1" {alliance} stationnum={1}></FieldCheckboxRobot>
                <FieldCheckboxRobot label="Park 2" {alliance} stationnum={2}></FieldCheckboxRobot>
                <FieldCheckboxRobot label="Park 3" {alliance} stationnum={3}></FieldCheckboxRobot>
            </div>
        {/each}
    </div>

    <div class="reviewcontainer">
        {#each alliances as alliance}
            <div>
                <h2>{titleCaseWord(alliance)} Endgame</h2>
                <Field label="Grass Carrots" store={createSecondOrderPropertyStore(scores, alliance, 'grass_tele')}></Field>
                <Field label="FS Carrots" store={createSecondOrderPropertyStore(scores, alliance, 'feeding_station_tele')}></Field>
                <Field label="PZ Bunnies" store={createSecondOrderPropertyStore(scores, alliance, 'endgame_bunnies')}></Field>
            </div>
        {/each}
    </div>

    <div class="reviewcontainer">
        {#each alliances as alliance}
            <div>
                <h2>Carrot Hits for {titleCaseWord(alliance)}</h2>
                <StationSuffixedField label="Opponent 1" alliance={alliance == 'red' ? 'blue' : 'red'} stationnum={1}></StationSuffixedField>
                <StationSuffixedField label="Opponent 2" alliance={alliance == 'red' ? 'blue' : 'red'} stationnum={2}></StationSuffixedField>
                <StationSuffixedField label="Opponent 3" alliance={alliance == 'red' ? 'blue' : 'red'} stationnum={3}></StationSuffixedField>
            </div>
        {/each}
    </div>

    <div class="reviewcontainer">
        <div>
            <h2>Fouls for Red</h2>
            <Field label="Foul Points" store={redFouls}></Field>
        </div>
        <div>
            <h2>Fouls for Blue</h2>
            <Field label="Foul Points" store={blueFouls}></Field>
        </div>
    </div>

    <div class="reviewcontainer">
        <div>
            <h2>Red Alliance Cards</h2>
            <div style="display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;margin-bottom: 30px;">
                <Card isRedAlliance={true} stationid={1}></Card>
                <Card isRedAlliance={true} stationid={2}></Card>
                <Card isRedAlliance={true} stationid={3}></Card>
            </div>
        </div>
        <div>
            <h2>Blue Alliance Cards</h2>
            <div style="display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;margin-bottom: 30px">
                <Card isRedAlliance={false} stationid={1}></Card>
                <Card isRedAlliance={false} stationid={2}></Card>
                <Card isRedAlliance={false} stationid={3}></Card>
            </div>
        </div>
    </div>
</main>

<style lang="scss">
    main {
        padding-bottom: 50px;
    }
    .reviewcontainer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-bottom: 30px;
        > * {
            &:nth-child(1) {
                background-color: #380000;
            }

            &:nth-child(2) {
                background-color: #001638;
            }
            border: 1px white dashed;
        }
    }

    :global(:root) {
        touch-action: pan-y;
        height: 100%;
    }

    :global(body) {
        margin: 0 !important;
        padding: 0;
    }
</style>
