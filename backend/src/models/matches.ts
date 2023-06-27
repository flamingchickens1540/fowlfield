
import { MatchData, PartialMatch } from "@fowltypes";
import * as db from "./db";



export class DBMatch {
    get id() {return this.data.id}
    
    get redScore() {return this.data.redScore}
    set redScore(value) {this.data.redScore = value; db.updateMatch({id:this.data.id, redScore:value})}
    get blueScore() {return this.data.blueScore}
    set blueScore(value) {this.data.blueScore = value; db.updateMatch({id:this.data.id, blueScore:value})}
    
    get type() {return this.data.type}
    set type(value) {this.data.type = value; db.updateMatch({id:this.data.id, type:value})}
    get matchNumber() {return this.data.matchNumber}
    set matchNumber(value) {this.data.matchNumber = value; db.updateMatch({id:this.data.id, matchNumber:value})}
    get elimRound() {return this.data.elimRound}
    set elimRound(value) {this.data.elimRound = value; db.updateMatch({id:this.data.id, elimRound:value})}
    get elimGroup() {return this.data.elimGroup}
    set elimGroup(value) {this.data.elimGroup = value; db.updateMatch({id:this.data.id, elimGroup:value})}
    get elimInstance() {return this.data.elimInstance}
    set elimInstance(value) {this.data.elimInstance = value; db.updateMatch({id:this.data.id, elimInstance:value})}
    
    
    get redAlliance() {return this.data.redAlliance}
    set redAlliance(value) {this.data.redAlliance = value; db.updateMatch({id:this.data.id, redAlliance:value})}
    get blueAlliance() {return this.data.blueAlliance}
    set blueAlliance(value) {this.data.blueAlliance = value; db.updateMatch({id:this.data.id, blueAlliance:value})}

    get red1() {return this.data.red1}
    set red1(value) {this.data.red1 = value; db.updateMatch({id:this.data.id, red1:value})}
    get red2() {return this.data.red2}
    set red2(value) {this.data.red2 = value; db.updateMatch({id:this.data.id, red2:value})}
    get red3() {return this.data.red3}
    set red3(value) {this.data.red3 = value; db.updateMatch({id:this.data.id, red3:value})}
    get blue1() {return this.data.blue1}
    set blue1(value) {this.data.blue1 = value; db.updateMatch({id:this.data.id, blue1:value})}
    get blue2() {return this.data.blue2}
    set blue2(value) {this.data.blue2 = value; db.updateMatch({id:this.data.id, blue2:value})}
    get blue3() {return this.data.blue3}
    set blue3(value) {this.data.blue3 = value; db.updateMatch({id:this.data.id, blue3:value})}

    get startTime() {return this.data.startTime}
    set startTime(value) {this.data.startTime = value; db.updateMatch({id:this.data.id, startTime:value})}

    get state() {return this.data.state}
    set state(value) {this.data.state = value; db.updateMatch({id:this.data.id, state:value})}

    constructor(private data:MatchData){}
    


    getData() {
        return this.data;
    }

    update(data:PartialMatch) {
        this.data = {...this.data, ...data},
        db.updateMatch(data)
    }
}
