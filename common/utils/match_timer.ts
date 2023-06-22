import { MatchPeriod } from "../types";





const durations: [MatchPeriod, number][] = [
    [MatchPeriod.PREMATCH, 0],
    [MatchPeriod.AUTO, 15],
    [MatchPeriod.PAUSE, 2],
    [MatchPeriod.TELEOP, 135],
    [MatchPeriod.POSTMATCH, 0]
]

export function getPeriodDuration(period:MatchPeriod):number {
    return durations.find((duration) => duration[0]===period)![1]
}
export function getRemainingTimeInPeriod(time:number) {
    const [period, totaltime] = getTimingInfo(time)
    return totaltime - time
}

export function getElapsedTimeInPeriod(time:number) {
    const [period, totaltime] = getTimingInfo(time)    
    return  time - totaltime + getPeriodDuration(period)
}


export function getMatchState(time:number):MatchPeriod {
    return getTimingInfo(time)[0]
}

function getTimingInfo(time:number):[MatchPeriod, number] {
    let cumulative = 0;
    let output = durations.find(([state, stateDuration]) => {
        cumulative += stateDuration
        return (cumulative >= time)
    })
    return [output?.[0] ?? MatchPeriod.POSTMATCH, cumulative];
}