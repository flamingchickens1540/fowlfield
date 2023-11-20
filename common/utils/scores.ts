import type { MatchData, ScoreBreakdown } from '../types/types';

type PointsBreakdown = {
    autoBunny:  number
    finalBunny: number
    autoTaxi:   number
    endgamePark:number
    targetHits: number
    foulPoints : number
}

export function calculatePointBreakdown(breakdown: ScoreBreakdown):PointsBreakdown {
    if (breakdown == null) {
        return {
            autoBunny: 0,
            finalBunny:0,
            autoTaxi: 0,
            endgamePark:0,
            targetHits:0,
            foulPoints:0
        }
    }
    return {
        autoBunny  : 5 * breakdown.autoBunnyCount,
        finalBunny : 5 * breakdown.finalBunnyCount,
        autoTaxi   : 3 * breakdown.autoTaxiBonus.filter((v) => v).length,
        endgamePark: 3 * breakdown.endgameParkBonus.filter((v) => v).length,
        targetHits : 2 * sum(breakdown.targetHits, (v) => v),
        foulPoints : sum(breakdown.fouls, (v) => v.value)
    }
}


function sum<T>(input:T[], converter: ((v:T) => number)) {
    let sum = 0
    input.forEach((v) => sum += converter(v))
    return sum
}

export function sumBreakdownPoints(c:PointsBreakdown) {
    return c.autoBunny + c.autoTaxi + c.endgamePark + c.finalBunny + c.targetHits + c.foulPoints
}

export function calculateAlliancePoints(c:ScoreBreakdown) {
    return sumBreakdownPoints(calculatePointBreakdown(c))
}

export function calculateScoringInfo(match:MatchData) {
    const redPoints = calculatePointBreakdown(match.redScoreBreakdown)
    const bluePoints = calculatePointBreakdown(match.blueScoreBreakdown)
    return {
        redBreakdown:redPoints,
        redScore: sumBreakdownPoints(redPoints),
        blueBreakdown:bluePoints,
        blueScore: sumBreakdownPoints(bluePoints)
    }
}