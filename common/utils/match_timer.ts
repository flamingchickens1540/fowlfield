import { MatchPeriod } from "../types";

const durations: [MatchPeriod, number][] = [
    [MatchPeriod.PREMATCH, 0],
    [MatchPeriod.AUTO, 15],
    [MatchPeriod.PAUSE, 2],
    [MatchPeriod.TELEOP, 135],
    [MatchPeriod.POSTMATCH, 0]
]


export function getMatchState(time:number):MatchPeriod {
    let cumulative = 0;
    let output = durations.find(([state, stateDuration]) => {
        cumulative += stateDuration
        return (cumulative >= time)
    })
    return output?.[0] ?? MatchPeriod.POSTMATCH;
}