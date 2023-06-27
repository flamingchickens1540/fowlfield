import { PartialTeam, TeamData } from "@fowltypes";
import { DBSettings } from "models/settings";
import { DBTeam } from "models/teams";
import * as db from "./models/db";


let teams:{[key:number]:DBTeam}
let isReady:boolean = false;
let settings:DBSettings

export async function loadTeams() {
    teams = await db.getTeams()
    isReady = true;
}

export function isDBLoaded() {
    return isReady
}
export function getTeam(id:number) {
    return teams[id]
}

export function getTeams():{[key:number]:DBTeam} {
    return teams;
}

export function updateTeam(data:PartialTeam) {
    if (teams[data.id] == null) {console.warn("cannot find team with id", data.id);return}
    teams[data.id]?.update(data)
    return teams[data.id]
}

export function deleteTeam(id:number) {
    if (teams[id] == null) {console.warn("cannot delete team with id", id);return}
    db.deleteTeam(id)
    delete teams[id]
}

export function newTeam(data:TeamData) {
    if (teams[data.id] != null) {console.warn("already have team with id", data.id);return}
    db.setTeam(data)
    teams[data.id] = new DBTeam(data)
    console.log(teams)
    return teams[data.id]
}

