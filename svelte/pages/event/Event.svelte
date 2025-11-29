<script lang="ts">
    import { eventData, loadedMatch, preloadedMatch, teamList } from '~/lib/store'
    import TeamEntry from './components/TeamEntry.svelte'
    import type { Team } from '@prisma/client'
    import socket from '~/lib/socket'
    import { derived, get } from 'svelte/store'
    import writableDerived from 'svelte-writable-derived'
    import { getBlankTeam } from '~common/utils/blanks'

    let nextTeam: Team = getBlankTeam()
    function addTeam() {
        socket.emit('newTeam', nextTeam)
        nextTeam = getBlankTeam()
    }
    const { atLunch, lunchReturnTime } = eventData
    lunchReturnTime.setWritable()
    atLunch.setWritable()
    $: {
        console.log('EVENTDATA', { $atLunch, $lunchReturnTime })
    }

    const lunchReturnPretty = writableDerived(
        lunchReturnTime,
        ($lunchReturnTime) => {
            const date = new Date($lunchReturnTime)
            return date.getHours() + ':' + date.getMinutes().toFixed(0).padStart(0)
        },
        (time) => {
            const date = new Date()
            const [hours, minutes] = time.split(':')
            date.setHours(parseInt(hours))
            date.setMinutes(parseInt(minutes))
            date.setSeconds(0)
            console.log(date.getTime())
            return date.getTime()
        }
    )
    const teams = derived(teamList, ($teams) => Object.values($teams).sort((a, b) => a.display_number.get().localeCompare(b.display_number.get(), undefined, { numeric: true, sensitivity: 'base' })))
    const teamCount = derived(teams, ($list) => $list.length)
</script>

<main>
    <h1>Teams ({$teamCount})</h1>
    <div id="teamlist">
        <div class="tableheader">
            <div class="tableitem">Number</div>
            <div class="tableitem">Display</div>
            <div class="tableitem">Name</div>
            <div class="tableitem">Robot Name</div>
            <div class="tableitem">Card</div>
            <div class="tableitem"></div>
        </div>
        {#key $teamList}
            {#each $teams as team, i}
                <TeamEntry {team} />
            {/each}
        {/key}
        <div id="addrow" class="tablerow">
            <input class="tableitem" type="number" bind:value={nextTeam.id} />
            <input class="tableitem centertext" type="text" bind:value={nextTeam.display_number} />
            <input class="tableitem" type="text" bind:value={nextTeam.team_name} />
            <input class="tableitem" type="text" bind:value={nextTeam.robot_name} />
            <div class="tableitem"></div>
            <button class="tableitem" on:click={addTeam}>+</button>
        </div>
    </div>
    <h1>Other</h1>
    <div class="other-item">
        <span>Lunch</span>
        <input type="time" step="300" bind:value={$lunchReturnPretty} />
        <button on:click={() => ($atLunch = !$atLunch)}>{$atLunch ? 'Stop Lunch' : 'Start Lunch'}</button>
    </div>
    <div class="other-item">
        <span>Loaded</span>
        <span>{$loadedMatch}</span>
    </div>
    <div class="other-item">
        <span>Preloaded</span>
        <span>{$preloadedMatch}</span>
    </div>
    <br />
</main>

<style lang="scss">
    .other-item {
        width: 40%;
        margin: 5px;
        margin-left: auto;
        margin-right: auto;
        // border: 1px solid white;
        padding: 10px;
        border-radius: 10px;
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        align-items: center;
        // height:50px;
        background-color: hsl(0, 0%, 20%);
        span {
            font-size: 20px;
        }
        button {
            height: 30px;
            margin: 0;
            padding: 5px;
            width: 150px;
            background-color: hsl(0, 0%, 30%);
        }
    }
    #teamlist {
        display: grid;
        grid-template-columns: 100px 100px auto auto 150px 50px;
        grid-auto-flow: row;
    }

    #addrow {
        button.tableitem {
            background-color: green;
        }
        .tableitem {
            margin-top: 40px;
        }
    }

    @import 'event';
</style>
