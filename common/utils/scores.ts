import {Match, Match_AllianceResults} from "@prisma/client";

type PointsBreakdown = {
    autoBunny:  number
    finalBunny: number
    autoTaxi:   number
    endgamePark:number
    targetHits: number
    foulPoints : number
}

export function calculateScoreBreakdown(breakdown: Match_AllianceResults):PointsBreakdown {
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
        autoTaxi   : 3 * countTrue(breakdown.auto_taxi_bonus_robot1, breakdown.auto_taxi_bonus_robot2, breakdown.auto_taxi_bonus_robot3),
        endgamePark: 5 * countTrue(breakdown.endgame_park_bonus_robot1, breakdown.endgame_park_bonus_robot2, breakdown.endgame_park_bonus_robot3),
        targetHits : 2 * sum((v) => v, breakdown.target_hits_robot1, breakdown.target_hits_robot2, breakdown.target_hits_robot3),
        foulPoints : breakdown.fouls.map((v) => v.foul_points).reduce((a,b) => a+b, 0)
    }
}

function countTrue(...bools:boolean[]) {
    let sum = 0
    bools.forEach((v) => sum += v ? 1 : 0)
    return sum
}

function sum<T>(converter:(v:T) => number, ...input:T[]) {
    let sum = 0

    input.forEach((v) => sum += converter(v))
    return sum
}

export function sumBreakdownPoints(c:PointsBreakdown) {
    return Object.values(c).reduce((a,b) => a+b, 0)
}

export function calculatePointsTotal(c:Match_AllianceResults) {
    return sumBreakdownPoints(calculateScoreBreakdown(c))
}

export function getWinner(match:Match):"red"|"blue" {
    const redPoints = calculatePointsTotal(match.red_scores)
    const bluePoints = calculatePointsTotal(match.blue_scores)
    return redPoints > bluePoints ? "red" : "blue"
}

export function getScores(match:Match) {
    const redPoints = calculateScoreBreakdown(match.red_scores)
    const bluePoints = calculateScoreBreakdown(match.blue_scores)
    return {
        redBreakdown:redPoints,
        redScore: sumBreakdownPoints(redPoints),
        blueBreakdown:bluePoints,
        blueScore: sumBreakdownPoints(bluePoints)
    }
}