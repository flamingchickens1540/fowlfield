<script lang="ts">
    import { alliances, getTeamNumber, teamList } from '~/lib/store'
    import { derived } from 'svelte/store'
    import { type AlliancePosition } from '~common/types'

    export let seed: 1 | 2 | 3 | 4
    const alliance = derived(alliances, ($alliances) => $alliances[seed])
    console.error($alliances)
    Object.values($alliance).forEach((position) => position.setWritable(true))

    function setTeamAlliance(position: AlliancePosition, team: string) {
        if (team == '' || team == '0') {
            $alliance[position].set(null)
            return null
        }
        const teamNum = getTeamNumber(team)
        if (teamNum == null) {
            return
        }
        $alliance[position].set(teamNum)
    }
    const captain = derived($alliance.captain, (member) => $teamList[member ?? 0]?.display_number.get() ?? '')
    captain.subscribe(console.warn)
    const pick1 = derived($alliance.first_pick, (member) => $teamList[member ?? 0]?.display_number.get() ?? '')
    const pick2 = derived($alliance.second_pick, (member) => $teamList[member ?? 0]?.display_number.get() ?? '')
    const pick3 = derived($alliance.third_pick, (member) => $teamList[member ?? 0]?.display_number.get() ?? '')
</script>

<div class="container">
    <div>Alliance {seed}</div>
    <input
        value={$captain}
        on:input={(e) => {
            setTeamAlliance('captain', e.currentTarget.value.trim())
        }}
        list="teams"
    />
    <input
        value={$pick1}
        on:input={(e) => {
            setTeamAlliance('first_pick', e.currentTarget.value.trim())
        }}
        list="teams"
    />
    <input
        value={$pick2}
        on:input={(e) => {
            setTeamAlliance('second_pick', e.currentTarget.value.trim())
        }}
        list="teams"
    />
    <input
        value={$pick3}
        on:input={(e) => {
            setTeamAlliance('third_pick', e.currentTarget.value.trim())
        }}
        list="teams"
    />
</div>

<style>
    .container {
        display: contents;
    }
    * {
        font-size: 20px;
    }
    input {
        height: 30px;
    }
</style>
