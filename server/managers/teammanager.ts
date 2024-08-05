import {Card, ExtendedTeam, PartialMatch, PartialTeam, TeamData} from '~common/types';
import {average} from '~common/utils';
import {calculatePointsTotal} from "~common/utils/scores";
import {buildStats, DBTeam} from "~/models/teams";
import {matchmanager} from "./index";
import * as db from "../models/db";
import {$Enums} from "@prisma/client";
import {Settings} from "~/models/settings";
import prisma from "~/models/db";


let teams: { [key: number]: DBTeam }
let isReady: boolean = false;

export async function loadTeams() {
    teams = await db.getTeams()
    isReady = true;
}

export function isDBLoaded() {
    return isReady
}

export function getTeam(id: number) {
    return teams[id]
}

export function getTeams(): { [key: number]: DBTeam } {
    return teams;
}


export function getAlliances(): { 1: number[], 2: number[], 3: number[], 4: number[] } {
    const alliances: { 1: number[], 2: number[], 3: number[], 4: number[] } = {1: [], 2: [], 3: [], 4: []}
    Object.values(teams).forEach(element => {
        if (element.alliance != 0 && element.alliancePosition != 0) {
            alliances[element.alliance][element.alliancePosition - 1] = element.id
        }
    });
    return alliances;

}



export function buildExtendedTeams(): { [key: number]: ExtendedTeam } {
    const teams: { [key: number]: ExtendedTeam & { _matchscores: number[] } } = {}
    Object.entries(getTeams()).forEach(([key, team]) => {
        teams[key] = {
            ...team.getData(),
            matchStats: {win: 0, loss: 0, tie: 0, rp: 0},
            _matchscores: []
        }
    })
    Object.values(matchmanager.getMatches()).forEach((match) => {
        const matchteams = [match.red1, match.red2, match.red3, match.blue1, match.blue2, match.blue3]

        matchteams.forEach((team: number, index: number) => {
            if (teams[team] == null) {
                return
            }
            const isRed = index < 3
            teams[team]._matchscores.push(isRed ? calculatePointsTotal(match.redScoreBreakdown) : calculatePointsTotal(match.blueScoreBreakdown))
            const dq = (isRed ? match.redCards : match.blueCards)[index % 3] == Card.RED
            buildStats(match, isRed, dq, teams[team].matchStats)
        })
    });

    Object.values(teams).forEach((team) => {
        team.matchStats.avg_score = average(team._matchscores)
    })

    return teams
}


export async function getTeamMatches(team: number): Promise<Pick<ExtendedTeam, "matchStats">> {

    let stats = {
        win: 0,
        loss: 0,
        tie: 0,
        rp: 0,
        avg_score: 0
    }
    const matches = await prisma.match.findMany({
        where: {
            OR: [
                {red1: team},
                {red2: team},
                {red3: team},
                {blue1: team},
                {blue2: team},
                {blue3: team}
            ]
        }
    })
    for await (const match of matches) {
        let isRed = false;
        let card: $Enums.Card = "none";
        switch (team) {
            case match.red1:
                isRed = true;
                card = match.red_scores.card_robot1;
                break;
            case match.red2:
                isRed = true;
                card = match.red_scores.card_robot2;
                break;
            case match.red3:
                isRed = true;
                card = match.red_scores.card_robot2;
                break;
            case match.blue1:
                isRed = false;
                card = match.blue_scores.card_robot1;
                break;
            case match.blue2:
                isRed = false;
                card = match.blue_scores.card_robot2;
                break;
            case match.blue3:
                isRed = false;
                card = match.blue_scores.card_robot3;
                break;
        }
        await buildStats(match, isRed, card == "red", stats)
    }
    return {
        matchStats: stats
    }
}


export async function updateSetting<K extends keyof Settings, T extends Settings[K]>(key: K, value: T) {
    const resp = await settings.replaceOne({key}, {key, value}, {upsert: true})
    if (!resp.acknowledged) {
        logger.warn("Could not store setting", key, value)
    }
}






export async function updateTeam(team: PartialTeam) {
    return await prisma.team.update({
        where: {id: team.id},
        data: team
    })
}


export async function deleteTeam(id: number) {
    return await prisma.team.delete({where: {id}})
}
