<script lang="ts">
    import { derived } from 'svelte/store'
    import { createPropertyStore, createSecondOrderSocketPropertyStore } from '~/lib/socketStore'
    import matchData, { teamList } from '~/lib/store'
    import type { RobotPosition } from '~common/types'
    import { titleCaseWord } from '~common/utils/format'
    import InputWithButtons from './InputWithButtons.svelte'

    export let station: 1 | 2 | 3
    export let alliance: 'red' | 'blue'
    export const pos = `${alliance}${station}` as RobotPosition
    const robot = derived([matchData[pos], teamList], ([$teamid, $teams]) => $teams[$teamid]?.display_number?.get() ?? '____')
    const scoreBreakdown = createPropertyStore(matchData.scores, alliance)
    let lastHitTime: number = 0
    let undoStopwatchValue = '—'

    const hits = createSecondOrderSocketPropertyStore(matchData.scores, alliance, `hits_robot${station}`)
    function registerHit() {
        lastHitTime = Date.now()
        $hits++
        // socket.emit('registerHit', dsposstring)
    }

    function undoHit() {
        lastHitTime = 0
        $hits--
        // socket.emit('undoHit', dsposstring)
    }

    setInterval(() => {
        const time = Math.round((Date.now() - lastHitTime) / 1000)
        undoStopwatchValue = time > 15 ? '—' : time + 's'
    }, 250)

    const didPark = createSecondOrderSocketPropertyStore(matchData.scores, alliance, `auto_park_robot${station}`)
</script>

<div class="scoring-container" style="--buttoncolor:{alliance == 'red' ? 'var(--bgred)' : 'var(--bgblue)'}">
    <button class="robot-label" on:click={() => (window.location.search = prompt('What station are you') ?? window.location.search)}>
        <span>{titleCaseWord(alliance)} {station} - {$robot}</span>
    </button>
    <div id="misccontainer">
        <div class="v-group">
            <div class="bunnycontainer">
                <span style="font-size:25px;">Auto Feeding Station</span>
                <InputWithButtons store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, `feeding_station_auto`)}></InputWithButtons>
            </div>
            <div class="bunnycontainer">
                <span style="font-size:25px;">Auto Grass</span>
                <InputWithButtons store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, `grass_auto`)}></InputWithButtons>
            </div>
        </div>
        <button class="mobilitybutton" on:click={() => ($didPark = !$didPark)} style="background-color:{$didPark ? 'var(--parked)' : 'var(--notparked)'}">Parked?</button>
        <div class="v-group">
            <div class="bunnycontainer">
                <span style="font-size:25px;">Final Feeding Station</span>
                <InputWithButtons store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, `feeding_station_tele`)}></InputWithButtons>
            </div>
            <div class="bunnycontainer">
                <span style="font-size:25px;">Final Grass</span>
                <InputWithButtons store={createSecondOrderSocketPropertyStore(matchData.scores, alliance, `grass_tele`)}></InputWithButtons>
            </div>
        </div>
    </div>

    <div class="hit-tracker">
        <button class="btn undo-btn" on:click={undoHit}>Undo ({undoStopwatchValue})</button>
        <button class="btn hit-btn" on:click={registerHit}>Hit ({$hits ?? 0})</button>
    </div>
</div>

<style lang="scss">
    .mobilitybutton {
        font-size: 50px;
        flex: 1;
        margin: 0px;
        --parked: #00bf10;
        --notparked: #363636;
    }
    .scoring-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        top: 5px;
        bottom: 5px;
        left: 5px;
        right: 5px;
        padding: 5px;
        max-height: 100vh;
        gap: 25px;
        overflow: hidden;
    }
    .robot-label {
        height: 40px;
        background-color: var(--buttoncolor);
        font-size: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        border: 1px white dashed;
    }
    .hit-tracker {
        width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 10px;
        .btn {
            height: 100%;
            box-sizing: border-box;
            margin: 0;
        }
        .hit-btn {
            flex: 2;
            font-size: 60px;
        }
        .undo-btn {
            flex: 1;
            font-size: 40px;
            background-color: orange;
        }
    }
    #misccontainer {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 5px;
        flex-grow: 1;
        > * {
            width: 100%;
        }
    }

    .v-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 2;
        gap: 10px;

        .bunnycontainer {
            background-color: #433e44;
            padding: 10px;

            border-radius: 5px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        }
    }

    .btn {
        background-color: var(--buttoncolor, rgb(122, 0, 0));
    }
</style>
