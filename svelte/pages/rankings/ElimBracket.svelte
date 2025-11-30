<script lang="ts" context="module">
    import { schedule } from '~common/utils/elims_bracket'
    export type LineData = { line: LeaderLine; startElement: HTMLElement; endElement: HTMLElement } | null

    export const reverseSchedule: Record<string, { red?: { match: number; winner: boolean }; blue?: { match: number; winner: boolean } }> = {}
    Object.values(schedule).forEach((match) => {
        if (match.winnerTo) {
            reverseSchedule[schedule[match.winnerTo.match].matchId] ??= {}
            reverseSchedule[schedule[match.winnerTo.match].matchId][match.winnerTo.alliance] = { match: match.matchNumber, winner: true }
        }
        if (match.loserTo) {
            reverseSchedule[schedule[match.loserTo.match].matchId] ??= {}
            reverseSchedule[schedule[match.loserTo.match].matchId][match.loserTo.alliance] = { match: match.matchNumber, winner: false }
        }
    })
</script>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import Match from './components/BracketMatch.svelte'
    import LeaderLine from 'leader-line-new'
    import { type Writable, writable } from 'svelte/store'

    function drawLine(a: string, b: string, loss: boolean = false, startOffset: number = 0): LineData {
        const startElement = document.getElementById(a)!
        const endElement = document.getElementById(b)!
        const line = new LeaderLine(LeaderLine.pointAnchor(startElement, { x: '100%', y: loss ? 40 : 20 }), LeaderLine.pointAnchor(endElement, { x: 0, y: 30 }), {
            path: 'grid',
            startSocket: 'right',
            endSocket: 'left',
            color: loss ? '#f6f6a6' : '#a6f6a6',
            startSocketGravity: loss ? [20 + startOffset, 0] : [startOffset, 0],
            dash: {
                animation: {
                    timing: 'linear'
                }
            }
        })
        return { line, startElement, endElement }
    }

    function createLines(start: string, win: string, lose?: string, loseOffset?: number) {
        lines.update((data) => {
            data[start] ??= [null, null]
            data[start][0] = drawLine(start, win, false)
            if (lose != null) {
                data[start][1] = drawLine(start, lose, true, loseOffset)
            }
            return data
        })
    }

    let lines: Writable<{ [key: string]: [LineData, LineData] }> = writable({})
    // onMount(() => {
    setTimeout(() => {
        console.warn('onmount')
        createLines('sf1m1', 'sf3m1', 'sf4m1', 25)
        createLines('sf2m1', 'sf3m1', 'sf4m1')
        createLines('sf4m1', 'sf5m1')
        createLines('sf3m1', 'f1m1', 'sf5m1')
        createLines('sf5m1', 'f1m1')
    }, 100)
    // })
    onDestroy(() => {
        lines.update((data) => {
            for (let [key, [line1, line2]] of Object.entries(data)) {
                line1?.line.remove()
                line2?.line.remove()
            }
            return {}
        })
    })
</script>

<div class="estop-container">
    <div class="matchcontainer" id="container-sf1m1"><Match {lines} title="Match 1" id="sf1m1"></Match></div>
    <div class="matchcontainer" id="container-sf2m1"><Match {lines} title="Match 2" id="sf2m1"></Match></div>
    <div class="matchcontainer" id="container-sf4m1"><Match {lines} title="Match 4" id="sf4m1"></Match></div>
    <div class="matchcontainer" id="container-sf3m1"><Match {lines} title="Match 3" id="sf3m1"></Match></div>
    <div class="matchcontainer" id="container-sf5m1"><Match {lines} title="Match 5" id="sf5m1"></Match></div>
    <div class="matchcontainer" id="container-f1m1"><Match {lines} title="Finals" id="f1m1"></Match></div>
</div>

<style lang="scss">
    .matchcontainer {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    :global(:root) {
        touch-action: none;
        height: 100%;
        overscroll-behavior-y: none;
    }
    :global(body) {
        margin: 0 !important;
        padding: 0;
    }
    #container-sf1m1 {
        grid-column: 1;
        grid-row: 1 / span 2;
    }
    #container-sf2m1 {
        grid-column: 1;
        grid-row: 5 / span 2;
    }
    #container-sf4m1 {
        grid-column: 2;
        grid-row: 10 / span 2;
    }
    #container-sf3m1 {
        grid-column: 2;
        grid-row: 3 / span 2;
    }
    #container-sf5m1 {
        grid-column: 3;
        grid-row: 9 / span 2;
    }
    #container-f1m1 {
        grid-column: 4;
        grid-row: 6 / span 2;
    }
    .estop-container {
        position: absolute;
        padding: 10px;

        left: 0;
        right: 0;

        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);

        display: grid;
        grid-template-columns: repeat(4, calc((100% - 240px) / 4));
        column-gap: 80px;
        row-gap: -40px;
        grid-template-rows: repeat(11, calc(125px / 2));
    }
</style>
