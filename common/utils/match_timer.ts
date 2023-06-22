import { MatchPeriod } from "../types";





const durations: [MatchPeriod, number][] = [
    [MatchPeriod.PREMATCH, 0],
    [MatchPeriod.AUTO, 15],
    [MatchPeriod.PAUSE, 2],
    [MatchPeriod.TELEOP, 135],
    [MatchPeriod.POSTMATCH, 0]
]

export function getPeriodDuration(period: MatchPeriod): number {
    return durations.find((duration) => duration[0] === period)![1]
}
export function getRemainingTimeInPeriod(time: number) {
    const [period, totaltime] = getTimingInfo(time)
    return round(totaltime - time, 3)
}

export function getElapsedTimeInPeriod(time: number) {
    const [period, totaltime] = getTimingInfo(time)
    return round(time - totaltime + getPeriodDuration(period), 3)
}


export function getMatchState(time: number): MatchPeriod {
    return getTimingInfo(time)[0]
}

function getTimingInfo(time: number): [MatchPeriod, number] {
    let cumulative = 0;
    let output = durations.find(([state, stateDuration]) => {
        cumulative += stateDuration
        return (cumulative >= time)
    })
    return [output?.[0] ?? MatchPeriod.POSTMATCH, cumulative];
}

function round(value: number, places: number): number {
    const pad = 10 ** places
    return Math.round(value * pad) / pad
}