import { Match, Match_AllianceResults } from '@prisma/client'

export type PointsBreakdown = {
    autoBunny: number
    finalBunny: number
    autoTaxi: number
    endgamePark: number
    targetHits: number
    foulPoints: number
}

export function calculateScoreBreakdown(
    breakdown: Match_AllianceResults
): PointsBreakdown {
    if (breakdown == null) {
        return {
            autoBunny: 0,
            finalBunny: 0,
            autoTaxi: 0,
            endgamePark: 0,
            targetHits: 0,
            foulPoints: 0
        }
    }
    return {
        autoBunny: 5 * breakdown.auto_bunnies,
        finalBunny: 5 * breakdown.final_bunnies,
        autoTaxi:
            3 *
            countTrue(
                breakdown.auto_taxi_bonus_robot1,
                breakdown.auto_taxi_bonus_robot2,
                breakdown.auto_taxi_bonus_robot3
            ),
        endgamePark:
            5 *
            countTrue(
                breakdown.endgame_park_bonus_robot1,
                breakdown.endgame_park_bonus_robot2,
                breakdown.endgame_park_bonus_robot3
            ),
        targetHits:
            2 *
            sum(
                (v) => v,
                breakdown.target_hits_robot1,
                breakdown.target_hits_robot2,
                breakdown.target_hits_robot3
            ),
        foulPoints: breakdown.fouls
            .map((v) => v.foul_points)
            .reduce((a, b) => a + b, 0)
    }
}

function countTrue(...bools: boolean[]) {
    let sum = 0
    bools.forEach((v) => (sum += v ? 1 : 0))
    return sum
}

function sum<T>(converter: (v: T) => number, ...input: T[]) {
    let sum = 0

    input.forEach((v) => (sum += converter(v)))
    return sum
}

export function sumBreakdownPoints(c: PointsBreakdown) {
    return Object.values(c).reduce((a, b) => a + b, 0)
}

export function calculatePointsTotal(c: Match_AllianceResults) {
    return sumBreakdownPoints(calculateScoreBreakdown(c))
}

export function getWinner(match: Match): 'red' | 'blue' | 'tie' {
    const redPoints = calculatePointsTotal(match.red_scores)
    const bluePoints = calculatePointsTotal(match.blue_scores)
    return redPoints == bluePoints
        ? 'tie'
        : redPoints > bluePoints
          ? 'red'
          : 'blue'
}

export function getScores(match: Match) {
    const redBreakdown = calculateScoreBreakdown(match.red_scores)
    const blueBreakdown = calculateScoreBreakdown(match.blue_scores)
    const redScore = sumBreakdownPoints(redBreakdown)
    const blueScore = sumBreakdownPoints(blueBreakdown)
    const winner = getWinner(match)
    let redRP = redScore
    let blueRP = blueScore
    if (winner == 'red') {
        redRP += blueScore / 2
    } else if (winner == 'blue') {
        blueRP += redScore / 2
    }
    return {
        redBreakdown,
        blueBreakdown,
        redScore,
        blueScore,
        redRP,
        blueRP,
        winner
    }
}

export function getAlliances(match: Match) {
    return {
        red: [
            { team: match.red1, card: match.red_scores.card_robot1 },
            { team: match.red2, card: match.red_scores.card_robot2 },
            { team: match.red3, card: match.red_scores.card_robot3 }
        ],
        blue: [
            { team: match.blue1, card: match.blue_scores.card_robot1 },
            { team: match.blue2, card: match.blue_scores.card_robot2 },
            { team: match.blue3, card: match.blue_scores.card_robot3 }
        ]
    }
}

export function getRedAlliance(match: Match) {
    return [
        { team: match.red1, card: match.red_scores.card_robot1 },
        { team: match.red2, card: match.red_scores.card_robot2 },
        { team: match.red3, card: match.red_scores.card_robot3 }
    ]
}

export function getBlueAlliance(match: Match) {
    return [
        { team: match.blue1, card: match.blue_scores.card_robot1 },
        { team: match.blue2, card: match.blue_scores.card_robot2 },
        { team: match.blue3, card: match.blue_scores.card_robot3 }
    ]
}
