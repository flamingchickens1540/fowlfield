import { DBMatch } from "./models/matches";
import * as db from "./models/db"
import { MatchState, PartialMatch } from "@fowltypes";


let matches:{[key:string]:DBMatch}
let preloaded:string = ""
let loaded:string = ""
let isLoaded:boolean = false;
async function loadMatches() {
    matches = await db.getMatches()
    const matchlist = Object.values(matches)
    preloaded = matchlist.find((match) => match.state == MatchState.IN_PROGRESS || match.state == MatchState.LOADED || match.state == MatchState.PRELOADED)?.id ?? matchlist[0].id
    loaded = matchlist.find((match) => match.state == MatchState.IN_PROGRESS || match.state == MatchState.LOADED)?.id ?? matchlist[0].id
    isLoaded = true;
}

function isDBLoaded() {
    return isLoaded
}
function getMatch(id:string) {
    return matches[id]
}

function getMatches():{[key:string]:DBMatch} {
    return matches;
}

function updateMatch(data:PartialMatch) {
    if (matches[data.id] == null)
    matches[data.id]?.update(data)
    return matches[data.id]
}

function getCurrentMatch():DBMatch {
    return getMatch(loaded)
}

function getPreloadMatch():DBMatch {
    return getMatch(preloaded)
}

function setPreloadMatch(id:string):DBMatch {
    if (getPreloadMatch().state == MatchState.PRELOADED) {getPreloadMatch().state = MatchState.PENDING}
    preloaded = id;
    return getPreloadMatch()
}
function setLoadedMatch(id:string):DBMatch {
    if (getCurrentMatch().state == MatchState.LOADED) {getPreloadMatch().state = MatchState.PENDING}
    loaded = id;
    return getCurrentMatch()
}

function getLoadedMatchID():string {
    return loaded
}

export default {
    loadMatches,
    getMatch,
    updateMatch,
    getCurrentMatch,
    getMatches,
    getPreloadMatch,
    getLoadedMatchID,
    setPreloadMatch,
    setLoadedMatch,
    isDBLoaded
}