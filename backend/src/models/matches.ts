import { Match } from "../ipc/ipctypes";
import { BracketsManager } from "brackets-manager";
import { InMemoryDatabase } from "brackets-memory-db";
import express from "express"
const storage = new InMemoryDatabase()
const manager = new BracketsManager(storage)
import * as db from "./db"
import { ExtendedMatch, PartialMatch } from "../types";

console.log("matches")


export class DBMatch implements ExtendedMatch {
    get id() {return this.data.id}
    
    get redScore() {return this.data.redScore}
    set redScore(value) {this.data.redScore = value, db.updateMatch({id:this.data.id, redScore:value})}
    get blueScore() {return this.data.blueScore}
    set blueScore(value) {this.data.blueScore = value, db.updateMatch({id:this.data.id, blueScore:value})}
    
    get type() {return this.data.type}
    set type(value) {this.data.type = value, db.updateMatch({id:this.data.id, type:value})}
    get matchNumber() {return this.data.matchNumber}
    set matchNumber(value) {this.data.matchNumber = value, db.updateMatch({id:this.data.id, matchNumber:value})}
    get elimRound() {return this.data.elimRound}
    set elimRound(value) {this.data.elimRound = value, db.updateMatch({id:this.data.id, elimRound:value})}
    get elimGroup() {return this.data.elimGroup}
    set elimGroup(value) {this.data.elimGroup = value, db.updateMatch({id:this.data.id, elimGroup:value})}
    get elimInstance() {return this.data.elimInstance}
    set elimInstance(value) {this.data.elimInstance = value, db.updateMatch({id:this.data.id, elimInstance:value})}
    
    get red1() {return this.data.red1}
    set red1(value) {this.data.red1 = value, db.updateMatch({id:this.data.id, red1:value})}
    get red2() {return this.data.red2}
    set red2(value) {this.data.red2 = value, db.updateMatch({id:this.data.id, red2:value})}
    get red3() {return this.data.red3}
    set red3(value) {this.data.red3 = value, db.updateMatch({id:this.data.id, red3:value})}
    get blue1() {return this.data.blue1}
    set blue1(value) {this.data.blue1 = value, db.updateMatch({id:this.data.id, blue1:value})}
    get blue2() {return this.data.blue2}
    set blue2(value) {this.data.blue2 = value, db.updateMatch({id:this.data.id, blue2:value})}
    get blue3() {return this.data.blue3}
    set blue3(value) {this.data.blue3 = value, db.updateMatch({id:this.data.id, blue3:value})}

    constructor(private data:ExtendedMatch){}


    getData() {
        return this.data;
    }

    update(data:PartialMatch) {
        this.data = {...this.data, ...data},
        db.updateMatch(data)
    }
}

const server = express()

server.get("/bracket", async (req, res) => {
    const data = await manager.get.tournamentData(0)
    res.set("Access-Control-Allow-Origin", "*")
    res.json({
        stages: data.stage,
        matches: data.match,
        matchGames: data.match_game,
        participants: data.participant
    })
})


export async function configureBracket() {
    await manager.create({
        tournamentId: 0,
        name: 'Elimination Matches',
        type: 'double_elimination',
        seeding: ['Alliance 1', 'Alliance 2', 'Alliance 3', 'Alliance 4'],
        settings: { grandFinal: 'double' },
      });
    server.listen(3000)
    await manager.update.match({
        id: 0, // First match of winner bracket (round 1)
        opponent1: { score: 16, result: 'win' },
        opponent2: { score: 12 },
      });
}
