import * as db from "../models/db"
import { PartialMatch } from '~common/types';
import { DBSettings } from "~/models/settings";
import { MatchMaker } from "~/matchmaker";
import {createLogger} from "~/logger";
import {prisma} from "~/models/db";
import {Match, Match_State} from "@prisma/client";

const logger = createLogger("matchmanager")


let isReady:boolean = false;
let settings:DBSettings
let matchMaker:MatchMaker
export async function loadMatches() {
    settings = await DBSettings.getInstance()
    matchMaker = new MatchMaker()
    const matchCount = await prisma.match.count()
    if (matchCount == 0) {
        const match = matchMaker.advanceQualsMatch()
        settings.loadedMatch = match.id;
        settings.preloadedMatch = match.id;
    }
    isReady = true;
}

export function isDBLoaded() {
    return isReady
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

export async function updatePreloadedMatch(id:string):Promise<Match> {
    settings.preloadedMatch = id;
    return getPreloadedMatch()
}
export function updateLoadedMatch(id:string):Promise<Match> {
    settings.loadedMatch = id;
    return getLoadedMatch()
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