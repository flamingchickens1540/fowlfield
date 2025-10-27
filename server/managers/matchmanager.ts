import { PartialMatch } from '~common/types'
import { MatchMaker } from '~/matchmaker'
import { createLogger } from '~/logger'
import { prisma } from '~/managers/db'
import { Match } from '@prisma/client'
import { eventState } from '~/managers/settings'
import { io } from '~/sockets'

const logger = createLogger('matchmanager')

let matchMaker: MatchMaker
export async function loadMatches() {
    matchMaker = new MatchMaker()
    const matchCount = await prisma.match.count()
    if (matchCount == 0) {
        const match = await matchMaker.advanceQualsMatch()
        console.log(match)
        eventState.loadedMatch = match.id
        eventState.preloadedMatch = match.id
    } else {
        const match = (await prisma.match.findFirst())!
        eventState.loadedMatch = match.id
        eventState.preloadedMatch = match.id
    }
}

export async function getMatches(): Promise<Record<string, Match>> {
    const matches = await prisma.match.findMany()
    return Object.fromEntries(matches.map((match) => [match.id, match]))
}

export function getMatch(id: string) {
    return prisma.match.findUnique({ where: { id } })
}

export async function updateMatch(data: PartialMatch) {
    const { id } = data
    const updateData: Partial<Match> = data
    delete updateData.id
    return prisma.match.update({ where: { id }, data: updateData })
}

export async function getLoadedMatch(): Promise<Match | null> {
    return prisma.match.findUnique({ where: { id: eventState.loadedMatch } })
}

export async function getPreloadedMatch(): Promise<Match | null> {
    return prisma.match.findUnique({ where: { id: eventState.preloadedMatch } })
}

export async function updatePreloadedMatch(id: string) {
    eventState.preloadedMatch = id
    const preloadedMatch = await getPreloadedMatch()
    if (preloadedMatch == null) {
        logger.error({ eventState, id, preloadedMatch }, 'could not find preload match')
        return
    }
    io.emit('preloadMatch', preloadedMatch)
}
export async function updateLoadedMatch(id: string) {
    eventState.loadedMatch = id
    const loadedMatch = await getLoadedMatch()
    if (loadedMatch == null) {
        logger.error({ eventState, id, loadedMatch }, 'could not find load match')
        return
    }
    io.emit('loadMatch', loadedMatch)
}

export function getMatchMaker(): MatchMaker {
    return matchMaker
}

export async function getLastFinals(): Promise<Match | null> {
    const scheduleItem = matchMaker.getBracket()?.getFinalMatch()
    if (scheduleItem != null) {
        return prisma.match.findUnique({ where: { id: scheduleItem.details.matchId } })
    }
    return null
}

export function advanceMatches(type: 'qualification' | 'elimination') {
    if (type == 'qualification') {
        return matchMaker.advanceQualsMatch()
    } else {
        return matchMaker.advanceElimMatch()
    }
}

export function notifyMatchUpdated(match: Match) {
    if (match.state == 'posted') {
        matchMaker.updateBracket(match)
    }
}
