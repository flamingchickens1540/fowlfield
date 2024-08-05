import { ExtendedTeam, PartialTeam,  TeamMatchStats } from '~common/types';
import * as db from "./db"
import { DBMatch } from "./matches";
import { calculatePointsTotal } from "~common/utils/scores";
import {Match} from "@prisma/client";
import {prisma} from "./db";

export class DBTeam implements TeamData {
    get id() {return this.data.id}
    
    
    constructor(private data:TeamData){
        if (data.card == null) {
            data.card = Card.NONE
        }
    }
    get name() {return this.data.name}
    set name(value) {this.data.name = value; db.updateTeam({id:this.data.id, name:value})}
    get displaynum() {return this.data.displaynum}
    set displaynum(value) {this.data.displaynum = value; db.updateTeam({id:this.data.id, displaynum:value})}
    get robotname() {return this.data.robotname}
    set robotname(value) {this.data.robotname = value; db.updateTeam({id:this.data.id, robotname:value})}
    get alliance() {return this.data.alliance}
    set alliance(value) {this.data.alliance = value; db.updateTeam({id:this.data.id, alliance:value})}
    get alliancePosition() {return this.data.alliancePosition}
    set alliancePosition(value) {this.data.alliancePosition = value; db.updateTeam({id:this.data.id, alliancePosition:value})}
    get card() {return this.data.card}
    set card(value) {this.data.card = value; db.updateTeam({id:this.data.id, card:value})}


    getData() {
        return this.data;
    }

    async getExtendedData():Promise<ExtendedTeam> {
        return {
            ...this.data,
            ...await db.getTeamMatches(this.id)
        }
    }

    update(data:PartialTeam) {
        this.data = {...this.data, ...data},
        db.updateTeam(data)
    }
}





const registerWin = (stats:TeamMatchStats, isWinner: boolean, winnerscore: number, loserscore: number) => {
    if (isWinner) {
        stats.win++
        stats.rp += winnerscore
        stats.rp += loserscore
    } else {
        stats.loss++
        stats.rp += loserscore
    }
}

const registerDraw = (stats:TeamMatchStats, teamScore: number) => {
    stats.tie++;
    stats.rp += teamScore
}

export async function buildStats(match: Match, isRed:boolean, isDQ:boolean, stats:TeamMatchStats) {
    const redScore = isDQ ? 0 : calculatePointsTotal(match.red_scores)
    const blueScore = isDQ ? 0 : calculatePointsTotal(match.blue_scores)
    if (match.type == "elimination") {return;}
    if (redScore > blueScore) {
        registerWin(stats, isRed, redScore, blueScore)
    } else if (redScore < blueScore) {
        registerWin(stats, !isRed, blueScore, redScore)
    } else {
        registerDraw(stats, isRed ? redScore : blueScore)
    }
}