import { Match, Match_Results } from '@prisma/client'
import { ToteKey } from '../types'

export type PointsBreakdown = {
    auto_carrots: number
    auto_park: number
    coopertition: number
    tele_carrots: number
    tele_bunnies: number
    tele_hits: number
    foul: number
}

function getBlankPointsBreakdown(): PointsBreakdown {
    return {
        auto_carrots: 0,
        auto_park: 0,
        coopertition: 0,
        tele_carrots: 0,
        tele_bunnies: 0,
        tele_hits: 0,
        foul: 0
    }
}
// 1 point per balloon in low zone
// 6 points per bunny in low zone
// 3x2^B points per balloon in tote with B bunnies
// Foul points
// 20 point coopertition bonus
export function calculatePointsBreakdown(breakdown: Match_Results): { red: PointsBreakdown; blue: PointsBreakdown } {
    const points = { red: getBlankPointsBreakdown(), blue: getBlankPointsBreakdown() }
    if (breakdown == null) {
        return points
    }
    for (const alliance_data of [
        { points: points.red, breakdown: breakdown.red },
        { points: points.blue, breakdown: breakdown.blue }
    ]) {
        const { points, breakdown: alliance_breakdown } = alliance_data
        points.auto_carrots += 5 * alliance_breakdown.feeding_station_auto // 5 points per carrot in feeding station
        points.auto_carrots += 1 * alliance_breakdown.grass_auto // 1 point per carrot in the grass

        points.auto_park += 5 * countTrue(alliance_breakdown.auto_park_robot1, alliance_breakdown.auto_park_robot2, alliance_breakdown.auto_park_robot3) // 5 points for robot partially in the carrot patch at end of auto

        points.tele_carrots += 10 * alliance_breakdown.feeding_station_tele
        points.tele_carrots += 1 * alliance_breakdown.grass_tele
        points.tele_hits += 5 * alliance_breakdown.total_hits

        points.tele_bunnies += 10 * alliance_breakdown.endgame_bunnies
        points.foul = alliance_breakdown.foul_points
        if (breakdown.cabbages_in_patch) {
            points.coopertition = 20
        }
    }

    return points
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

export function calculateTotalPoints(c: Match_Results) {
    const breakdown = calculatePointsBreakdown(c)
    return {
        red: sumBreakdownPoints(breakdown.red),
        blue: sumBreakdownPoints(breakdown.blue)
    }
}
const getResult = ({ red, blue }: { red: number; blue: number }) => {
    return red == blue ? 'tie' : red > blue ? 'red' : 'blue'
}
export function getWinner(match: Match): 'red' | 'blue' | 'tie' {
    const { red, blue } = calculateTotalPoints(match.scores)
    return getResult({ red, blue })
}

export function getScores(match: Match) {
    const breakdown = calculatePointsBreakdown(match.scores)
    const redScore = sumBreakdownPoints(breakdown.red)
    const blueScore = sumBreakdownPoints(breakdown.blue)
    const winner = getResult({ red: redScore, blue: blueScore })
    let redRP = redScore
    let blueRP = blueScore
    if (winner == 'red') {
        // If red wins, redRp = redScore, blueRp = blueScore/2
        blueRP /= 2
    } else if (winner == 'blue') {
        // If blue wins, blueRp = blueScore, redRp = redScore/2
        redRP /= 2
    }
    return {
        redBreakdown: breakdown.red,
        blueBreakdown: breakdown.blue,
        redScore,
        blueScore,
        redRP,
        blueRP,
        winner
    }
}

export function getAlliances(match: Match) {
    return {
        red: getRedAlliance(match),
        blue: getBlueAlliance(match)
    }
}

export function getRedAlliance(match: Match) {
    return [
        { team: match.red1, card: match.scores.red.card_robot1 },
        { team: match.red2, card: match.scores.red.card_robot2 },
        { team: match.red3, card: match.scores.red.card_robot3 }
    ]
}

export function getBlueAlliance(match: Match) {
    return [
        { team: match.blue1, card: match.scores.blue.card_robot1 },
        { team: match.blue2, card: match.scores.blue.card_robot2 },
        { team: match.blue3, card: match.scores.blue.card_robot3 }
    ]
}
