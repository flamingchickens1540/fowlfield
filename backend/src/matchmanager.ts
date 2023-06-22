import { DBMatch } from "./models/matches";
import * as db from "./models/db"
import { PartialMatch } from "../../types/types";


    let matches:{[key:string]:DBMatch}

async function loadMatches() {
    matches = await db.getMatches()
}

function getMatch(id:string) {
    return matches[id]
}

function addMatch(match:DBMatch) {
    matches[match.id] = match
}

function updateMatch(data:PartialMatch) {
    matches[data.id].update(data)
    return matches[data.id]
}

function getCurrentMatch():DBMatch {
    return getMatch("abcd")
}

export default {
    loadMatches,
    getMatch,
    addMatch,
    updateMatch,
    getCurrentMatch
}