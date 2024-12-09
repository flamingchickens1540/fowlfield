import { Match, Match_Results } from '@prisma/client'
import { ToteKey } from '../types'

export type PointsBreakdown = {
    tote_balloons: number
    empty_corral: number
    low_zone_bunny: number
    low_zone_balloon: number
    foul: number
}

function getBlankPointsBreakdown(): PointsBreakdown {
    return {
        tote_balloons: 0,
        empty_corral: 0,
        low_zone_bunny: 0,
        low_zone_balloon: 0,
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
    points.red.low_zone_balloon += 1 * breakdown.red.zone_balloons_own // 1 point per balloon in low zone
    points.red.low_zone_balloon += 1 * breakdown.blue.zone_balloons_opp // 1 point per balloon in low zone

    points.blue.low_zone_balloon += 1 * breakdown.blue.zone_balloons_own // 1 point per balloon in low zone
    points.blue.low_zone_balloon += 1 * breakdown.red.zone_balloons_opp // 1 point per balloon in low zone

    points.red.low_zone_bunny += 6 * breakdown.red.zone_bunnies // 6 points per bunny in low zone
    points.blue.low_zone_bunny += 6 * breakdown.blue.zone_bunnies // 6 points per bunny in low zone

    for (const id in breakdown.totes) {
        const tote = breakdown.totes[id as ToteKey]
        const multiplier = 3 * 2 ** tote.bunnies // 3x2^B points per balloon in tote with B bunnies
        points.red.tote_balloons += tote.red_balloons * multiplier
        points.blue.tote_balloons += tote.blue_balloons * multiplier
    }
    points.blue.foul = breakdown.blue.foul_points
    points.red.foul = breakdown.red.foul_points
    if (breakdown.corral_empty) {
        // 20 point coopertition bonus
        points.red.empty_corral = 20
        points.blue.empty_corral = 20
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
