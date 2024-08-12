<script lang="ts">

    import matchData, {
        abortMatch,
        commitMatch, fetchMatch, loadedMatch,
        loadedMatches,
        matchList, preloadedMatch,
        remainingTimeInPeriod,
        setPreloadingTrack,
        startMatch,
        teamList
    } from '~/lib/store'
    import { onMount } from 'svelte'
    import { derived, type Readable, type Unsubscriber, writable } from 'svelte/store'

    import { formatDuration } from '~common/utils/format'
    import socket from '~/lib/socket'
    import configureAudio from '~/lib/audio'
    import { statusColors, statusMessages } from '~/lib/consts'

    import TeamDatalistEntry from '~/lib/components/TeamDatalistEntry.svelte'
    import TeamEntry from './components/TeamEntry.svelte'

    import Sortable, { Swap } from 'sortablejs'
    import ScoreSummary from '~/lib/components/ScoreSummary.svelte'
    import type { Match, Match_State } from '@prisma/client'
    import type { RobotPosition } from '~common/types'

    Sortable.mount(new Swap())

    setPreloadingTrack(true)

    configureAudio()


    const buttonData: { [key in Match_State]: { text: string; color: string; cb: () => void } } = {
        not_started: { text: 'Start', color: '#02ae02', cb: startMatch },
        in_progress: { text: 'Abort', color: '#b30000', cb: abortMatch },
        ended: { text: 'Publish', color: '#0000b8', cb: commitMatch },
        posted: { text: 'Republish', color: '#000000', cb: commitMatch }
    }

    function getColorValue(color: string, alpha: number) {
        return color + (alpha * 255).toString(16)
    }

    function transitionLoadState() {
        if ($preloadedMatch != $matchid) {
            socket.emit('preloadMatch', $matchid)
        } else {
            socket.emit('preloadMatch', $matchid)
            socket.emit('loadMatch', $matchid)
        }
    }

    function resetMatch() {
        const resp = prompt("Are you sure you want to reset this match? If so, type 'yes'")
        if (resp?.toLowerCase().trim() == 'yes') {
            console.log('resetting match', $matchid)
            socket.emit('resetMatch', $matchid)
        }
    }
    function getLoadButtonByMatch(id:string) {
        if (id == $loadedMatch) return getLoadButton("loaded")
        if (id == $preloadedMatch) return getLoadButton("preloaded")
        return getLoadButton("none")
    }
    function getLoadButton(state:"loaded"|"preloaded"|"none") {
        if (state == "loaded") return { text: 'Reload', buttoncolor: '#840082', itemstyle: 'background-color:#680066' }
        if (state == "preloaded") return { text: 'Load', buttoncolor: '#b400b1', itemstyle: 'background-color:#683900' }
        return { text: 'Preload', buttoncolor: '#a56600', itemstyle: '' }
    }
    $: $preloadedMatch, console.log('PRELOADED', $preloadedMatch)
    $: $loadedMatch, console.log('LOADED', $loadedMatch)
    const matchLoadState = writable(getLoadButton("none"))
    $: $matchLoadState, console.log('STATE', $matchLoadState)
    $: {
        console.log('MATCHID', $matchid)
        if ($preloadedMatch == $matchid) {
            matchLoadState.set(getLoadButton("preloaded"))
        } else if ($loadedMatch == $matchid) {
            matchLoadState.set(getLoadButton("loaded"))
        } else {
            matchLoadState.set(getLoadButton("none"))
        }
    }

    let showTeams = false
    let teamlistunsub: Unsubscriber
    const { red1, red2, red3, blue1, blue2, blue3, elim_info } = matchData
    teamlistunsub = teamList.subscribe((value) => {
        if (Object.values(value).length > 0) {
            showTeams = true
            teamlistunsub()
        }
    })
    const matchid = matchData.id
    const matchstate = matchData.state
    const matchtype = matchData.type
    const matches: Readable<Match[]> = derived(matchList, Object.values)

    let redTeamParent: HTMLElement
    let blueTeamParent: HTMLElement

    let setSortingEnabled: (enabled: boolean) => void


    onMount(() => {
        function onEnd(event: Sortable.SortableEvent) {
            const teamA = event.from.children[event.oldIndex!].id.replace(/^team-/, '')
            const teamB = event.item.id.replace(/^team-/, '')
            const storeA = matchData[teamA as RobotPosition]
            const storeB = matchData[teamB as RobotPosition]
            const teamAId = storeA.get()
            storeA.set(storeB.get())
            storeB.set(teamAId)
        }

        const redSortable = new Sortable(redTeamParent, {
            draggable: '.item',
            group: 'teams',
            swap: true,
            onEnd
        })

        const blueSortable = new Sortable(blueTeamParent, {
            draggable: '.item',
            group: 'teams',
            swap: true,
            onEnd
        })
        setSortingEnabled = (enabled) => {
            redSortable.option('sort', enabled)
            redSortable.option('group', {
                name: 'teams',
                pull: enabled,
                put: enabled
            })
            blueSortable.option('sort', enabled)
            blueSortable.option('group', {
                name: 'teams',
                pull: enabled,
                put: enabled
            })
            $isSortingEnabled = enabled
        }

        matchData.state.subscribe((v) => setSortingEnabled(v == "not_started"))
    })

    let isSortingEnabled = writable(true)
</script>

<datalist id="teams">
    {#each Object.values($teamList) as team}
        <TeamDatalistEntry {team}></TeamDatalistEntry>
    {/each}
</datalist>

<main>
    <div id="scoring">
        <h2>Scoring</h2>
        <ScoreSummary></ScoreSummary>
    </div>

    <div id="sidebar-l">
        <h2>Matches</h2>
        <div id="matchGrid">
            {#each $matches as match, i}
                <div class="matchEntry" style={getLoadButton(match.id == $loadedMatch ? "loaded" : match.id == $preloadedMatch ? "preloaded" : match.id == $loadedMatch ? "loaded" : "none").itemstyle}>
                    <span>{match.id}</span>
                    <button disabled={match.id == $matchid} class="loadButton" on:click={() => (fetchMatch(match.id))}> Open </button>
                    <div class="statustext" style="background-color:{statusColors[match.state]}">{statusMessages[match.state]}</div>
                </div>
            {/each}
        </div>
        <button on:click={() => socket.emit('nextMatch', 'qualification')}>Next Quals</button>
        <button on:click={() => socket.emit('nextMatch', 'elimination')}>Next Elims</button>
    </div>
    <div id="sidebar-r">
        <h2>Match {$matchid ?? 'HELP'}</h2>
        <div class="row">
            <button on:click={transitionLoadState} class="match-control" style="background-color:{$matchLoadState.buttoncolor};">{$matchLoadState.text}</button>
            <button on:click={buttonData[$matchstate].cb} class="match-control" style="background-color:{buttonData[$matchstate].color};">{buttonData[$matchstate].text}</button>
        </div>
        <h3 id="match-time">{$matchstate != "in_progress" ? statusMessages[$matchstate] : formatDuration($remainingTimeInPeriod)}</h3>
        <p id="teams-header">Teams</p>
        <div id="teamsgrid">
            {#if $matchtype == "qualification"}
                <div class="row">
                    <div class="item item-1-1">Red</div>
                    <div class="item item-2-1">Blue</div>
                </div>
            {:else}
                <div class="row">
                    <div class="item item-1-1">Red ({$elim_info?.red_alliance})</div>
                    <div class="item item-2-1">Blue ({$elim_info?.blue_alliance})</div>
                </div>
            {/if}

            <div class="col" data-alliance="red" bind:this={redTeamParent}>
                {#if showTeams}
                    <div id="team-red1" class="item item-1-2">
                        <TeamEntry store={red1}></TeamEntry>
                    </div>
                    <div id="team-red2" class="item item-1-3">
                        <TeamEntry store={red2}></TeamEntry>
                    </div>
                    <div id="team-red3" class="item item-1-4">
                        <TeamEntry store={red3}></TeamEntry>
                    </div>
                {/if}
            </div>
            <div class="col" data-alliance="blue" bind:this={blueTeamParent}>
                {#if showTeams}
                    <div id="team-blue1" class="item item-2-2">
                        <TeamEntry store={blue1}></TeamEntry>
                    </div>
                    <div id="team-blue2" class="item item-2-3">
                        <TeamEntry store={blue2}></TeamEntry>
                    </div>
                    <div id="team-blue3" class="item item-2-4">
                        <TeamEntry store={blue3}></TeamEntry>
                    </div>
                {/if}
            </div>
            <button class="item" id="sorting-toggle" on:click={() => setSortingEnabled(!$isSortingEnabled)}><span id="lock-icon" class="material-symbols-outlined">{$isSortingEnabled ? 'lock_open_right' : 'lock'}</span> </button>
        </div>
        <div class="row">
            <button on:click={resetMatch} class="match-control" style="background-color:#501d1d;">Reset Match</button>
        </div>
    </div>
</main>

<style lang="scss">
    #lock-icon {
        width: 24px;

        text-align: center;
        overflow: hidden;
    }

    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');

    main {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: grid;
        grid-template-columns:
            [left] 340px
            [center] auto
            [right] 320px;
        grid-template-rows:
            [top] 50%
            [bottom] 50%;
    }

    :global(body) {
        margin: 0;
        overscroll-behavior: none;
    }

    #teamsgrid {
        margin-left: auto;
        margin-right: auto;
        display: grid;
        grid-template-columns: auto auto;
        grid-auto-flow: row;
        width: 100%;

        .col,
        .row {
            display: contents;

            &:nth-child(1) {
                .item {
                    border: none;
                }
            }

            &:last-child {
                & > * {
                    padding-bottom: 5px;
                }

                .item {
                    border: none;
                }
            }
        }
    }

    #sorting-toggle {
        grid-column: 1 / span 2;
        margin: 0;
        border-radius: 0 0 5px 5px;
        background-color: rgb(99, 99, 99);
    }

    #matchGrid {
        display: flex;
        flex-flow: column nowrap;
        overflow-y: scroll;

        .matchEntry:first-child {
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
        }

        .matchEntry:last-child {
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
        }

        padding-right: 0;
        max-height: 82vh;
        width: 320px;
        // &::-webkit-scrollbar {display: none;}
    }

    .matchEntry {
        background-color: rgba(100, 100, 100, 0.5);

        &:nth-child(odd) {
            background-color: rgba(100, 100, 100, 0.3);
        }

        box-sizing: border-box;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;

        width: 300px;
        padding: 10px 10px;
        align-items: center;

        & > * {
            margin-left: 5px;
            margin-right: 5px;
        }

        .statustext {
            padding: 0.1em 0.2em;
            width: 100px;
            border-radius: 7px;
            font-weight: 700;
        }

        span {
            flex-grow: 2;
            font-size: 20px;
        }

        button {
            padding: 0.2em 0.7em;
            background-color: #1a1a1af0;
        }
    }

    .row {
        display: grid;
        grid-auto-flow: row;
    }

    #sidebar-l {
        grid-column: 1;
        grid-row: 1 / span 2;
        background-color: #303030;
        padding: 10px;
    }

    #sidebar-r {
        grid-column: 3;
        grid-row: 1 / span 2;
        background-color: #303030;
        padding: 40px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
    }

    .item-1-1 {
        border-top-left-radius: 5px;
    }

    .item-2-1 {
        border-top-right-radius: 5px;
    }

    @mixin team-grid-position {
        @for $col from 1 through 2 {
            @for $row from 1 through 4 {
                .item-#{$col}-#{$row} {
                    grid-column: $col;
                    grid-row: $row;
                    @if $col == 1 {
                        background-color: var(--red);
                    } @else {
                        background-color: var(--blue);
                    }
                }
            }
        }
    }

    #scoring {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @include team-grid-position(); // input {
    // 	width: 20px;
    // }
</style>
