<script lang="ts">
    import { derived, get, type Writable } from 'svelte/store'
    import type { ChangeEventHandler } from 'svelte/elements'
    import { safeParseInt } from '~common/utils'
    import type { RobotPosition } from '~common/types'
    import matchData, { teamList } from '~/lib/store'
    import { createSecondOrderPropertyStore } from '~/lib/socketStore'

    export let label: string
    export let alliance:"red"|"blue"
    export let stationnum:1|2|3
    const station = `${alliance}${stationnum}` as RobotPosition

    const robot = derived([matchData[station], teamList], ([robot, teamList]) => teamList[robot]?.display_number.get() ?? '  _____  ')
    const store = createSecondOrderPropertyStore(matchData.scores, alliance, `auto_park_robot${stationnum}`)
    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement
        store.set(target.checked ?? get(store))
    }
</script>

<div class="row">
    <span>{label} ({$robot})</span>
    <div>
        <input type="checkbox" checked={$store} on:change={onChange} />
    </div>
</div>

<style lang="scss">
    .row {
        span {
            font-weight: bold;
            font-size: 1.5rem;
        }
        div {
            flex-grow: 2;
        input {
            width: 90%;
            outline-color: rgba(183, 183, 183, 0.3);
            background-color: #404040a0;
            accent-color: rgba(183, 183, 183, 0.63);
            padding: 5px;
            border-radius: 5px;
            font-size: 2rem;
            text-align: center;
            scale: 3;
        }
    }
        padding: 5px 100px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background-color: var(--bgcolor, #4a4a4a);
        border: solid #a0a0a0 1px;

        height: 60px;
        display: flex;
        gap: 50px;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background-color: var(--bgcolor, #4a4a4a);
        border: solid #a0a0a0 1px;
    }
</style>
