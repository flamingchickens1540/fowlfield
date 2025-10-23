<script lang="ts">
    import matchData, { teamList, loadedMatch } from '~/lib/store'
    import writableDerived from 'svelte-writable-derived'
    import type { Writable } from 'svelte/store'
    import type { SocketWritable } from '~/lib/socketStore'

    export let store: SocketWritable<number>

    store.setWritable()

    const { id } = matchData

    $: currentMatch = $id == $loadedMatch

    const prettyteamnum = writableDerived(
        store,
        (storevalue) => {
            return $teamList[storevalue]?.display_number.get()
        },
        (value, storevalue) => {
            if (value == '') {
                return 0
            }
            const team = Object.values($teamList).find((team) => team.display_number.get() == value)
            if (team != null) {
                return team.id.get()
            }

            return storevalue
        }
    )
</script>

<div class="row">
    <input bind:value={$prettyteamnum} style="--inputwidth:{currentMatch ? 60 : 100}px" list="teams" />
</div>

<style lang="scss">
    $inputcolor: rgb(59, 59, 59);
    .row {
        display: flex;
        margin: 5px;
        justify-content: space-between;
        align-items: center;
        border: solid $inputcolor 1px;
    }
    input {
        /* width:80%; */
        background-color: $inputcolor;
        border: 0;
        height: 20px;
        padding: 3px 5px;
        width: var(--inputwidth);
    }
</style>
