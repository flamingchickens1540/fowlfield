import { ExtendedTeam, MatchData, PartialTeam, TeamData, TeamMatchStats } from "@fowltypes";
import * as db from "./db"

export class DBTeam implements TeamData {
    get id() {return this.data.id}
    
    
    constructor(private data:TeamData){}
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

export function buildStats(match: MatchData, isRed:boolean, stats:TeamMatchStats) {
    if (match.type == "elimination") {return;}
    if (match.redScore > match.blueScore) {
        registerWin(stats, isRed, match.redScore, match.blueScore)
    } else if (match.redScore < match.blueScore) {
        registerWin(stats, !isRed, match.blueScore, match.redScore)
    } else {
        registerDraw(stats, isRed ? match.redScore : match.blueScore)
    }
}