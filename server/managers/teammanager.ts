import { PartialTeam, RankingEntry, TeamMatchStats } from '~common/types'
import { getBlueAlliance, getRedAlliance, getScores } from '~common/utils/scores'
import { Team } from '@prisma/client'
import prisma from '~/managers/db'
import { createLogger } from '~/logger'

const logger = createLogger('teammanager')

export function getTeam(id: number) {
    return prisma.team.findUnique({ where: { id } })
}

export async function getTeams(): Promise<Record<string, Team>> {
    const teams = await prisma.team.findMany()
    return Object.fromEntries(teams.map((team) => [team.id.toString(), team]))
}

export async function getAlliances() {
    const alliances = await prisma.playoffAlliance.findMany({})
    return new Map(alliances.map((alliance) => [alliance.seed, alliance]))
}

export async function getMatchStats(): Promise<{
    [team: number]: TeamMatchStats
}> {
    const stats: { [team: number]: TeamMatchStats } = {}
    const teams = await prisma.team.findMany()
    teams.forEach((team) => {
        stats[team.id] = {
            count: 0,
            win: 0,
            loss: 0,
            tie: 0,
            rp: 0,
            avg_score: 0
        }
    })
    const matches = await prisma.match.findMany()
    matches.forEach((match) => {
        const scores = getScores(match)
        getRedAlliance(match).forEach(({ team, card }) => {
            if (team == 0) return
            stats[team].count++
            switch (scores.winner) {
                case 'red':
                    stats[team].win++
                    break
                case 'blue':
                    stats[team].loss++
                    break
                case 'tie':
                    stats[team].tie++
                    break
            }
            if (card == 'none') {
                stats[team].rp += scores.redRP
            }
            stats[team].avg_score += scores.redScore
        })
        getBlueAlliance(match).forEach(({ team, card }) => {
            if (team == 0) return
            stats[team].count++
            switch (scores.winner) {
                case 'blue':
                    stats[team].win++
                    break
                case 'red':
                    stats[team].loss++
                    break
                case 'tie':
                    stats[team].tie++
                    break
            }
            if (card == 'none') {
                stats[team].rp += scores.blueRP
            }
            stats[team].avg_score += scores.blueScore
        })
    })

    Object.entries(stats).forEach(([team, stat]) => {
        if (stat.count != 0) {
            stat.avg_score /= stat.count
        }
    })

    return stats
}

export async function buildRankings(): Promise<RankingEntry[]> {
    const stats = getMatchStats()
    return Object.entries(stats)
        .sort((a, b) => b[1].rp - a[1].rp)
        .map(([team, stat], i) => {
            return {
                rank: i + 1,
                team: parseInt(team),
                ...stat
            }
        })
}

export async function updateTeam(team: PartialTeam) {
    const id = team.id
    delete team.id
    return prisma.team.update({
        where: { id },
        data: team
    })
}

export async function deleteTeam(id: number) {
    return await prisma.team.delete({ where: { id } })
}
