import * as db from "../models/db"
import { PartialMatch } from '~common/types';
import { DBSettings } from "~/models/settings";
import { MatchMaker } from "~/matchmaker";
import {createLogger} from "~/logger";
import {prisma} from "~/models/db";
import {Match, Match_State} from "@prisma/client";
import { settings } from '~/managers/settings'
import { io } from '~/sockets'

const logger = createLogger("matchmanager")

let matchMaker:MatchMaker
export async function loadMatches() {
    matchMaker = new MatchMaker()
    const matchCount = await prisma.match.count()
    if (matchCount == 0) {
        const match = await matchMaker.advanceQualsMatch()
        settings.loadedMatch = match.id;
        settings.preloadedMatch = match.id;
    }
}

export async function getMatches():Promise<Record<string, Match>> {
    const matches = await prisma.match.findMany()
    return Object.fromEntries(matches.map((match) => [match.id, match]));
}

export function getMatch(id:string) {
    return prisma.match.findUnique({where:{id}})
}


export async function updateMatch(data:PartialMatch) {
    return prisma.match.update({where:{id:data.id}, data})
}

export async function getLoadedMatch():Promise<Match> {
    return prisma.match.findUnique({where: {id: settings.loadedMatch}});
}

export async function getPreloadedMatch():Promise<Match> {
    return prisma.match.findUnique({where: {id: settings.preloadedMatch}});
}

export async function updatePreloadedMatch(id:string) {
    settings.preloadedMatch = id;
    io.emit("preloadMatch", await getPreloadedMatch())
}
export async function updateLoadedMatch(id:string) {
    settings.loadedMatch = id;
    io.emit("loadMatch", await getLoadedMatch())
}

export function getMatchMaker():MatchMaker {
    return matchMaker
}

export function advanceMatches(type:'qualification'|"elimination") {
    if (type == "qualification") {
        return matchMaker.advanceQualsMatch()
    } else {
        return matchMaker.advanceElimMatch()
    }
}


export function notifyMatchUpdated(match:Match) {
    if (match.state == "posted") {
        matchMaker.updateBracket(match)
    }
}