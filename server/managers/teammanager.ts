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
    const teams = await getTeamList()
    return Object.fromEntries(teams.map((team) => [team.id.toString(), team]))
}

export async function getTeamList(): Promise<Team[]> {
    return prisma.team.findMany({})
}

export async function getAlliances() {
    const alliances = await prisma.playoffAlliance.findMany({})
    console.log(alliances)
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
            dq: 0,
            avg_coop: 0,
            avg_score: 0
        }
    })
    const matches = await prisma.match.findMany()
    matches.forEach((match) => {
        if (match.type == 'elimination') {
            return
        }
        const scores = getScores(match)
        getRedAlliance(match).forEach(({ team, card }) => {
            if (team == 0 || stats[team] == null) return
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
            if (card != 'red') {
                stats[team].rp += scores.redRP
            } else {
                stats[team].dq++
            }

            stats[team].avg_score += scores.redScore
            stats[team].avg_coop += match.scores.corral_empty ? 1 : 0
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
            if (card != 'red') {
                stats[team].rp += scores.blueRP
            } else {
                stats[team].dq++
            }
            stats[team].avg_score += scores.blueScore
            stats[team].avg_coop += match.scores.corral_empty ? 1 : 0
        })
    })

    Object.entries(stats).forEach(([team, stat]) => {
        if (stat.count != 0) {
            stat.avg_score /= stat.count
            stat.avg_coop /= stat.count
        }
    })

    return stats
}

export async function buildRankings(): Promise<RankingEntry[]> {
    const stats = await getMatchStats()
    return Object.entries(stats)
        .sort((a, b) => b[1].rp - a[1].rp)
        .map(([team, stat], i) => {
            return {
                team: parseInt(team),
                match_stats: stat
            }
        })
}

export async function updateTeam(team: PartialTeam) {
    const id = team.id
    const updateData: Partial<Team> = team
    delete updateData.id
    return prisma.team.update({
        where: { id },
        data: updateData
    })
}

export async function deleteTeam(id: number) {
    return prisma.team.delete({ where: { id } })
}
