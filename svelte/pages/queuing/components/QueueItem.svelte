<script lang="ts">
    import matchData, { teamList } from '~/lib/store'
    import writableDerived from 'svelte-writable-derived'
    import { derived, writable, type Writable } from 'svelte/store'
    import { onMount } from 'svelte'
    import Sortable from 'sortablejs'
    import type { RobotPosition } from '~common/types'

    export let store: Writable<number>
    export let label: string

    let hasInitialized = false
    let prettyteamnum = writable('')
    const disableButton = derived(matchData.state, (state) => state !== 'not_started')
    teamList.subscribe((v) => {
        if (!hasInitialized && Object.keys(v).length > 0) {
            prettyteamnum = writableDerived(
                store,
                (storevalue) => {
                    return $teamList[storevalue]?.display_number.get()
                },
                (value, storevalue) => {
                    if (value == '') {
                        return 0
                    }
                    const team = Object.values($teamList).find((team) => team.display_number.get() == value)
                    if (team) {
                        return team.id.get()
                    }

                    return storevalue
                }
            )
            hasInitialized = true
        }
    })
</script>

<div class="row">
    <span>{label}</span>
    <input inputmode="numeric" disabled={$disableButton} bind:value={$prettyteamnum} list="teams" />
</div>

<style lang="scss">
    $inputcolor: rgb(59, 59, 59);
    .row {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;
        margin: 5px;
        height: 100%;
        width: 100%;

        border: solid $inputcolor 1px;

        background-color: var(--blue);
        &:nth-child(-n + 3) {
            background-color: var(--red);
        }
    }
    span {
        font-size: 40px;
    }
    input {
        /* width:80%; */
        color: #ececec;
        background-color: $inputcolor;
        border: 0;
        height: 50px;
        font-size: 30px;
        width: 150px;
        padding: 3px 5px;
    }
</style>
