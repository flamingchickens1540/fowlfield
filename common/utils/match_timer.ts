import { MatchPeriod } from "../types";





const durations: {[key in MatchPeriod]:number} = {
    [MatchPeriod.PREMATCH]: 0,
    [MatchPeriod.AUTO]: 15,
    [MatchPeriod.PAUSE]: 2,
    [MatchPeriod.TELEOP]: 135,
    [MatchPeriod.POSTMATCH]: 0
}

const orderedPeriods = [
    MatchPeriod.PREMATCH,
    MatchPeriod.AUTO,
    MatchPeriod.PAUSE,
    MatchPeriod.TELEOP,
    MatchPeriod.POSTMATCH
]

export function getPeriodDuration(period: MatchPeriod): number {
    return durations[period]
}
export function getRemainingTimeInPeriod(time: number) {
    const [period, totaltime] = getTimingInfo(time)
    return round(totaltime - time, 3)
}

export function getRemainingTimeInDisplayPeriod(time: number):number {
    const [period, totaltime] = getTimingInfo(time)
    switch (period) {
        case MatchPeriod.PREMATCH: return getPeriodDuration(MatchPeriod.AUTO);
        case MatchPeriod.AUTO: return round(totaltime - time, 3);
        case MatchPeriod.PAUSE: return getPeriodDuration(MatchPeriod.TELEOP);
        case MatchPeriod.TELEOP: return round(totaltime - time, 3);
        case MatchPeriod.POSTMATCH: return 0;
    }
}

export function getElapsedTimeInPeriod(time: number) {
    const [period, totaltime] = getTimingInfo(time)
    return round(time - totaltime + getPeriodDuration(period), 3)
}


export function getMatchPeriod(seconds: number): MatchPeriod {
    return getTimingInfo(seconds)[0]
}

function getTimingInfo(time: number): [MatchPeriod, number] {
    let cumulative = 0;
    let output = orderedPeriods.find((period) => {
        cumulative += durations[period]
        return (cumulative >= time)
    })
    return [output ?? MatchPeriod.POSTMATCH, cumulative];
}

function round(value: number, places: number): number {
    const pad = 10 ** places
    return Math.round(value * pad) / pad
}