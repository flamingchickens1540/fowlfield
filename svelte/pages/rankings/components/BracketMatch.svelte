<script lang="ts">
    import { calculateTotalPoints, getScores } from '~common/utils/scores'
    import { matchList, teamList } from '~/lib/store'
    import LeaderLine from 'leader-line-new'
    import type { Writable } from 'svelte/store'
    import { reverseSchedule, type LineData } from '~/pages/rankings/ElimBracket.svelte'
    import { getScheduleItem, schedule } from '~common/utils/elims_bracket'
    import type { Match } from '@prisma/client'

    export let title: string
    export let id: string
    export let lines: Writable<{ [key: string]: [LineData, LineData] }>
    const matchInfo = reverseSchedule[id]
    $: winline = $lines[id]?.[0]
    $: lossline = $lines[id]?.[1]
    $: match = $matchList[id]

    $: total = calculateTotalPoints(match?.scores)
    $: redscore = total.red
    $: bluescore = total.blue
    $: winner = match?.state != 'posted' || redscore == bluescore ? 'none' : redscore > bluescore ? 'red' : 'blue' //TODO: check ties
    $: redFeed = matchInfo?.red != null ? $matchList[schedule[matchInfo.red.match].matchId] : null
    $: blueFeed = matchInfo?.blue != null ? $matchList[schedule[matchInfo.blue.match].matchId] : null
    console.log({ id, matchInfo })

    function getFeedAlliance(feedMatch: Match | null, allianceInfo: { match: number; winner: boolean } | undefined): null | { alliance?: number; teams: [number | undefined, number | undefined, number | undefined] } {
        if (allianceInfo == null || feedMatch == null || feedMatch.state != 'posted') return null
        const winner = getScores(feedMatch).winner
        if (winner == 'tie') return null
        if ((winner == 'red' && allianceInfo.winner) || (winner == 'blue' && !allianceInfo.winner)) {
            return { alliance: feedMatch?.elim_info?.red_alliance, teams: [feedMatch?.red1, feedMatch?.red2, feedMatch?.red3] }
        } else {
            return { alliance: feedMatch?.elim_info?.blue_alliance, teams: [feedMatch?.blue1, feedMatch?.blue2, feedMatch?.blue3] }
        }
    }

    $: redFeedAlliance = getFeedAlliance(redFeed, matchInfo?.red)
    $: blueFeedAlliance = getFeedAlliance(blueFeed, matchInfo?.blue)
    $: {
        if (winner == 'red') {
            winline?.line?.setOptions({ start: LeaderLine.pointAnchor(winline.startElement, { x: '100%', y: 76 }) })
            lossline?.line?.setOptions({ start: LeaderLine.pointAnchor(lossline.startElement, { x: '100%', y: 109 }) })
        } else if (winner == 'blue') {
            winline?.line?.setOptions({ start: LeaderLine.pointAnchor(winline.startElement, { x: '100%', y: 109 }) })
            lossline?.line?.setOptions({ start: LeaderLine.pointAnchor(lossline.startElement, { x: '100%', y: 76 }) })
        } else {
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div {id} class="fullsize" style="--redweight:{winner == 'red' ? 900 : 'unset'};--blueweight:{winner == 'blue' ? 900 : 'unset'}">
    <span class="title">{title}</span>
    <div class="red alliance">{match?.elim_info?.red_alliance ?? redFeedAlliance?.alliance ?? (matchInfo?.red != null ? (matchInfo.red.winner ? 'W' : 'L') + matchInfo.red.match : '')}</div>
    <div class="blue alliance">{match?.elim_info?.blue_alliance ?? blueFeedAlliance?.alliance ?? (matchInfo?.blue != null ? (matchInfo.blue.winner ? 'W' : 'L') + matchInfo.blue.match : '')}</div>
    <div class="red teams">
        <span>{$teamList[match?.red1 ?? redFeedAlliance?.teams[0]]?.display_number.get() ?? ''}</span>
        <span>{$teamList[match?.red2 ?? redFeedAlliance?.teams[1]]?.display_number.get() ?? ''}</span>
        <span>{$teamList[match?.red3 ?? redFeedAlliance?.teams[2]]?.display_number.get() ?? ''}</span>
    </div>
    <div class="blue teams">
        <span>{$teamList[match?.blue1 ?? blueFeedAlliance?.teams[0]]?.display_number.get() ?? ''}</span>
        <span>{$teamList[match?.blue2 ?? blueFeedAlliance?.teams[1]]?.display_number.get() ?? ''}</span>
        <span>{$teamList[match?.blue3 ?? blueFeedAlliance?.teams[2]]?.display_number.get() ?? ''}</span>
    </div>
</div>

<style lang="scss">
    @mixin centered($content: center) {
        display: flex;
        justify-content: $content;
        align-items: center;
    }
    .title {
        grid-row: 1;
        grid-column: 1 / span 2;
        font-size: 30px;
        @include centered();
    }

    .alliance {
        @include centered();
        grid-column: 1;
        &.blue {
            background-color: rgb(68, 68, 198);
            border-bottom-left-radius: 5px;
        }
        &.red {
            background-color: rgb(209, 69, 69);
        }
    }

    .red {
        grid-row: 2;
        font-weight: var(--redweight);
    }
    .blue {
        grid-row: 3;
        font-weight: var(--blueweight);
    }

    .teams {
        @include centered(space-evenly);
        grid-column: 2;
        &.blue {
            background-color: rgb(99, 99, 226);
            border-bottom-right-radius: 5px;
        }
        &.red {
            background-color: rgb(235, 96, 96);
        }

        span {
            width: 100%;
        }
    }

    .fullsize {
        background-color: rgb(128, 128, 128);
        border-radius: 5px;
        width: 100%;
        height: 125px;
        display: grid;
        grid-template-columns: 40px auto;
        grid-template-rows: 60px auto auto;
    }
</style>
