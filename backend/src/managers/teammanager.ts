import { Card, ExtendedTeam, PartialTeam, TeamData } from "@fowltypes";
import { average } from '@fowlutils/index';
import { calculateAlliancePoints } from "@fowlutils/scores";
import { DBTeam, buildStats } from "models/teams";
import { matchmanager } from ".";
import * as db from "../models/db";


let teams:{[key:number]:DBTeam}
let isReady:boolean = false;

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


export function getAlliances():{1:number[], 2:number[], 3:number[], 4:number[]} {
    const alliances:{1:number[], 2:number[], 3:number[], 4:number[]} = {1:[],2:[],3:[],4:[]}
    Object.values(teams).forEach(element => {
        if (element.alliance != 0  && element.alliancePosition != 0) {        
            alliances[element.alliance][element.alliancePosition-1] = element.id
        }
    });
    console.log(alliances)
    return alliances;

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
    return teams[data.id]
}




export function buildExtendedTeams():{ [key: number]: ExtendedTeam } {
    const teams: { [key: number]: ExtendedTeam & {_matchscores:number[]}} = {}
    Object.entries(getTeams()).forEach(([key, team]) => {teams[key] = { 
        ...team.getData(), 
        matchStats: { win: 0, loss: 0, tie: 0, rp: 0},
        _matchscores:[]
    }})
    Object.values(matchmanager.getMatches()).forEach((match) => {
        const matchteams = [match.red1, match.red2, match.red3, match.blue1, match.blue2, match.blue3]

        matchteams.forEach((team: number, index: number) => {
            if (teams[team] == null) {return}
            const isRed = index<3
            teams[team]._matchscores.push(isRed ? calculateAlliancePoints(match.redScoreBreakdown) : calculateAlliancePoints(match.blueScoreBreakdown))
            const dq = (isRed ? match.redCards : match.blueCards)[index%3] == Card.RED
            buildStats(match, isRed, dq, teams[team].matchStats)
        })
    });

    Object.values(teams).forEach((team) => {
        team.matchStats.avg_score =  average(team._matchscores)
    })

    return teams
}

