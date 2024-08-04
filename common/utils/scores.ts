import type { MatchData, ScoreBreakdown } from '../types/types';
import {MatchScores} from "@prisma/client";

type PointsBreakdown = {
    autoBunny:  number
    finalBunny: number
    autoTaxi:   number
    endgamePark:number
    targetHits: number
    foulPoints : number
}

export function calculatePointBreakdown(breakdown: MatchScores):PointsBreakdown {
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
        autoBunny  : 5 * breakdown.auto_bunnies,
        finalBunny : 5 * breakdown.final_bunnies,
        autoTaxi   : 3 * addBools(breakdown.auto_taxi_bonus_robot1, breakdown.auto_taxi_bonus_robot2, breakdown.auto_taxi_bonus_robot3),
        endgamePark: 5 * addBools(breakdown.endgame_park_bonus_robot1, breakdown.endgame_park_bonus_robot2, breakdown.endgame_park_bonus_robot3),
        targetHits : 2 * sum((v) => v, breakdown.target_hits_robot1, breakdown.target_hits_robot2, breakdown.target_hits_robot3),
        foulPoints : 0 // FIXME - need to add fouls
    }
}

function addBools(...bools:boolean[]) {
    let sum = 0
    bools.forEach((v) => sum += v ? 1 : 0)
    return sum
}

function sum<T>(converter: ((v:T) => number), ...input:T[]) {
    let sum = 0
    input.forEach((v) => sum += converter(v))
    return sum
}

export function sumBreakdownPoints(c:PointsBreakdown) {
    return c.autoBunny + c.autoTaxi + c.endgamePark + c.finalBunny + c.targetHits + c.foulPoints
}

export function calculateAlliancePoints(c:MatchScores) {
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