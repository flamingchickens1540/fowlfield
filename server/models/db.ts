import {Card, ExtendedTeam, MatchData, PartialMatch, PartialTeam, TeamData} from '~common/types';
import {Settings} from "~/models/settings";
import {buildStats, DBTeam} from "~/models/teams";

import {PrismaClient} from '@prisma/client'
import {createLogger} from '~/logger'

const logger = createLogger("db")
export const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query'
        },
        {
            emit: 'event',
            level: 'info'
        },
        {
            emit: 'event',
            level: 'warn'
        },
        {
            emit: 'event',
            level: 'error'
        }
    ]
})
export default prisma

if (process.env.NODE_ENV != 'prod') {
    prisma.$on('query', (e) => {
        logger.trace({name: 'prisma'}, e.query)
    })
}
prisma.$on('info', (e) => {
    logger.info({ name: 'prisma' }, e.message)
})
prisma.$on('warn', (e) => {
    logger.warn({ name: 'prisma' }, e.message)
})
prisma.$on('error', (e) => {
    logger.error({ name: 'prisma' }, e.message)
})


export async function getTeamMatches(team: number): Promise<Pick<ExtendedTeam, "matchStats">> {
    
    let stats = {
        win: 0,
        loss: 0,
        tie: 0,
        rp: 0,
        avg_score:0
    }
    const matches = await prisma.match.findMany({
        where: {
            OR: [
                { red1: team },
                { red2: team },
                { red3: team },
                { blue1: team },
                { blue2: team },
                { blue3: team }
            ]
        }
    })
    for await (const match of matches) {
        let isRed = false;
        let card = Card.NONE;
        switch (team) {
            case match.red1: 
                isRed = true;
                card = match.red1_card as Card;
                break;
            case match.red2: 
                isRed = true;
                card = match.red2_card as Card;
                break;
            case match.red3: 
                isRed = true;
                card = match.red3_card as Card;
                break;
            case match.blue1: 
                isRed = false;
                card = match.blue1_card as Card;
                break;
            case match.blue2: 
                isRed = false;
                card = match.blue2_card as Card;
                break;
            case match.blue3: 
                isRed = false;
                card = match.blue3_card as Card;
                break;
        }
        await buildStats(match, isRed, card == Card.RED, stats)
    }
    return {
        matchStats: stats
    }
}

export async function getTeams(): Promise<{ [key: string]: DBTeam }> {
    let result: { [key: string]: DBTeam } = {}
    for await (const team of teams.find()) {
        result[team.id] = new DBTeam(team as unknown as TeamData)
    }
    return result
}
export async function updateSetting<K extends keyof Settings, T extends Settings[K]>(key: K, value: T) {
    const resp = await settings.replaceOne({ key }, { key, value }, { upsert: true })
    if (!resp.acknowledged) {
        logger.warn("Could not store setting", key, value)
    }
}

export async function readSettings() {
    const result: Settings = {
        loadedMatch: "",
        preloadedMatch: "",
        atLunch:false,
        lunchReturnTime:0
    }
    for await (const setting of settings.find()) {
        result[setting.key] = setting.value
    }
    return result
}
export async function updateMatch(match: PartialMatch) {
    const resp = await matches.updateOne({ id: match.id }, { $set: match })
    if (!resp.acknowledged) {
        logger.warn("Could not update match", match.id)
    }
}

export async function setMatch(match: MatchData) {
    const resp = await matches.replaceOne({ id: match.id }, match, { upsert: true })
    if (!resp.acknowledged) {
        logger.warn("Could not store match", match.id)
    }
}


export async function updateTeam(team: PartialTeam) {
    const resp = await teams.updateOne({ id: team.id }, { $set: team })
    if (!resp.acknowledged) {
        logger.warn("Could not update team", team.id)
    }
}

export async function setTeam(team: TeamData) {
    const resp = await teams.replaceOne({ id: team.id }, team, {upsert:true})
    if (!resp.acknowledged) {
        logger.warn("Could not update team", team.id)
    }
}

export async function deleteTeam(id:number) {
    const resp = await teams.deleteOne({ id: id })
    if (!resp.acknowledged) {
        logger.warn("Could not delete team", id)
    }
}
