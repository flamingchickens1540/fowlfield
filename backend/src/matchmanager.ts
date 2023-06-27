import { DBMatch } from "./models/matches";
import * as db from "./models/db"
import { MatchState, PartialMatch } from "@fowltypes";
import { DBSettings } from "models/settings";


let matches:{[key:string]:DBMatch}
let isReady:boolean = false;
let settings:DBSettings

export async function loadMatches() {
    matches = await db.getMatches()
    settings = await DBSettings.getInstance()
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
    if (matches[data.id] == null) {console.warn("cannot find match with id", data.id);return}
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

