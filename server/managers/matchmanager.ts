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
        const match = await prisma.match.findFirst()
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
    return prisma.match.update({ where: { id: data.id }, data })
}

export async function getLoadedMatch(): Promise<Match | undefined> {
    return prisma.match.findUnique({ where: { id: eventState.loadedMatch } })
}

export async function getPreloadedMatch(): Promise<Match | undefined> {
    return prisma.match.findUnique({ where: { id: eventState.preloadedMatch } })
}

export async function updatePreloadedMatch(id: string) {
    eventState.preloadedMatch = id
    io.emit('preloadMatch', await getPreloadedMatch())
}
export async function updateLoadedMatch(id: string) {
    eventState.loadedMatch = id
    io.emit('loadMatch', await getLoadedMatch())
}

export function getMatchMaker(): MatchMaker {
    return matchMaker
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
