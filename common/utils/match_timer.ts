import { MatchPeriod } from '../types'
import { roundToPlaces } from './format'

const durations: { [key in MatchPeriod]: number } = {
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
    const { period, periodEndTime } = getTimingInfo(time)
    return roundToPlaces(periodEndTime - time, 3)
}

export function getRemainingTimeInDisplayPeriod(time: number): number {
    const { period, periodEndTime } = getTimingInfo(time)
    switch (period) {
        case MatchPeriod.PREMATCH:
            return getPeriodDuration(MatchPeriod.AUTO)
        case MatchPeriod.AUTO:
            return roundToPlaces(periodEndTime - time, 3)
        case MatchPeriod.PAUSE:
            return getPeriodDuration(MatchPeriod.TELEOP)
        case MatchPeriod.TELEOP:
            return roundToPlaces(periodEndTime - time, 3)
        case MatchPeriod.POSTMATCH:
            return 0
    }
}

export function getElapsedTimeInPeriod(time: number) {
    const { period, periodEndTime } = getTimingInfo(time)
    return roundToPlaces(time - periodEndTime + getPeriodDuration(period), 3)
}

export function getMatchPeriod(seconds: number): MatchPeriod {
    return getTimingInfo(seconds).period
}

function getTimingInfo(time: number): {
    period: MatchPeriod
    periodEndTime: number
} {
    let cumulative = 0
    let output = orderedPeriods.find((period) => {
        cumulative += durations[period]
        return cumulative >= time
    })
    return {
        period: output ?? MatchPeriod.POSTMATCH,
        periodEndTime: cumulative
    }
}
