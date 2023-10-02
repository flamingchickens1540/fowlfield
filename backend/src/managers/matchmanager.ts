import { DBMatch } from "../models/matches";
import * as db from "../models/db"
import { MatchState, PartialMatch, MatchData } from '@fowltypes';
import { DBSettings } from "models/settings";
import { MatchMaker } from "matchmaker";
import rootLogger from "logger";

const logger = rootLogger.getLogger("matchmanager")


let matches:{[key:string]:DBMatch}
let isReady:boolean = false;
let settings:DBSettings
let matchMaker:MatchMaker
export async function loadMatches() {
    matches = await db.getMatches()
    settings = await DBSettings.getInstance()
    matchMaker = new MatchMaker()
    if (Object.keys(matches).length == 0) {
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
    return matches[id]
}

export function getMatches():{[key:string]:DBMatch} {
    return matches;
}

export function updateMatch(data:PartialMatch) {
    if (matches[data.id] == null) {logger.warn("cannot find match with id", data.id);return}
    matches[data.id]?.update(data)
    return matches[data.id]
}

export function getCurrentMatch():DBMatch {
    return getMatch(settings.loadedMatch) ?? Object.values(matches)[0]
}

export function getPreloadMatch():DBMatch {
    return getMatch(settings.preloadedMatch) ?? Object.values(matches)[0]
}

export function setPreloadMatch(id:string):DBMatch {
    settings.preloadedMatch = id;
    return getPreloadMatch()
}
export function setLoadedMatch(id:string):DBMatch {
    settings.loadedMatch = id;
    return getCurrentMatch()
}

export function getMatchMaker():MatchMaker {
    return matchMaker
}

export function newMatch(data:MatchData) {
    if (matches[data.id] != null) {logger.warn("already have match with id", data.id);return matches[data.id]}
    db.setMatch(data)
    matches[data.id] = new DBMatch(data)
    return matches[data.id]
}

export function advanceMatches(type:'qualification'|"elimination") {
    if (type == "qualification") {
        return matchMaker.advanceQualsMatch()
    } else {
        return matchMaker.advanceElimMatch()
    }
}


export function notifyMatchUpdated(match:DBMatch) {
    if (match.state == MatchState.POSTED) {
        matchMaker.updateBracket(match.getData())
    }
}