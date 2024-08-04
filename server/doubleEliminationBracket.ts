import rootLogger from "~/logger";

const bracketLogger = rootLogger.getLoggerWithLevel("bracket", "debug")
export type DoubleEliminationAlliance = 0|1|2|3|4

export type DoubleEliminationMatch = {
    matchNumber: number;
    matchId: string;
    elimRound: number;
    elimGroup: number;
    elimInstance: number;
    red: DoubleEliminationAlliance;
    blue: DoubleEliminationAlliance;
    winnerTo?:{match:number, alliance:"red"|"blue"}
    loserTo?:{match:number, alliance:"red"|"blue"}
};



export class DoubleEliminationBracket {
    private schedule: {[key:number]:DoubleEliminationMatch} = { // Makes thinking about the matches easier to avoid the index offset
        1:{
            matchNumber: 1,
            matchId: "sf1m1",
            elimRound: 4,
            elimGroup: 1,
            elimInstance: 1,
            red: 0,
            blue: 0,
            winnerTo:{match:3, alliance:"red"},
            loserTo:{match:4, alliance:"red"}
        },
        2:{
            matchNumber: 2,
            matchId: "sf2m1",
            elimRound: 4,
            elimGroup: 2,
            elimInstance: 1,
            red: 0,
            blue: 0,
            winnerTo:{match:3, alliance:"blue"},
            loserTo:{match:4, alliance:"blue"},
        },
        3:{
            matchNumber: 3,
            matchId: "sf3m1",
            elimRound: 4,
            elimGroup: 3,
            elimInstance: 1,
            red: 0,
            blue: 0,
            winnerTo:{match:6, alliance:"red"},
            loserTo:{match:5, alliance:"red"},
        },
        4:{
            matchNumber: 4,
            matchId: "sf4m1",
            elimRound: 2,
            elimGroup: 4,
            elimInstance: 1,
            red: 0,
            blue: 0,
            winnerTo:{match:5, alliance:"blue"},
        },
        5:{
            matchNumber: 5,
            matchId: "sf5m1",
            elimRound: 2,
            elimGroup: 5,
            elimInstance: 1,
            red: 0,
            blue: 0,
            winnerTo:{match:6, alliance:"blue"},
        },
        6:{
            matchNumber: 6,
            matchId: "f1m1",
            elimRound: 1,
            elimGroup: 1,
            elimInstance: 1,
            red: 0,
            blue: 0,
        },
        7:{
            matchNumber: 7,
            matchId: "f1m2",
            elimRound: 1,
            elimGroup: 1,
            elimInstance: 2,
            red: 0,
            blue: 0,
        },
        8:{
            matchNumber: 8,
            matchId: "f1m3",
            elimRound: 1,
            elimGroup: 1,
            elimInstance: 3,
            red: 0,
            blue: 0,
        },
    };
    private alliances: DoubleEliminationAlliance[] = [1,2,3,4];
    private scheduleIndex = 1;
    private netFinalWins = 0;
    
    constructor(currentmatch:number) {
        this.scheduleIndex=currentmatch+1
        this.schedule[1].red = this.alliances[0];
        this.schedule[1].blue = this.alliances[3];
        this.schedule[2].red = this.alliances[1];
        this.schedule[2].blue = this.alliances[2];
    }
    private recordedMatches = []

    update(matchNumber: number, winner: "red" | "blue"):boolean {
        bracketLogger.debug("recording match", matchNumber)
        //the logic to make double elimination work
        if (this.recordedMatches.includes(matchNumber)) {bracketLogger.warn("already recorded", matchNumber); return false}
        const match:DoubleEliminationMatch = this.schedule[matchNumber]
        
        const winningAlliance = winner === "red" ? match.red : match.blue;
        const losingAlliance  = winner === "red" ? match.blue : match.red;
        
        if (match.winnerTo != null) {this.schedule[match.winnerTo.match][match.winnerTo.alliance] = winningAlliance}
        if (match.loserTo != null) {this.schedule[match.loserTo.match][match.loserTo.alliance] = losingAlliance}
        switch (matchNumber) {
            case 6: {
                //finals 1
                this.schedule[7].red = match.red;
                this.schedule[7].blue = match.blue;
                this.netFinalWins += winner === "red" ? 1 : -1;
                break;
            }
            case 7: {
                //finals 2
                this.schedule[8].red = match.red;
                this.schedule[8].blue = match.blue;
                this.netFinalWins += winner === "red" ? 1 : -1;
                break;
            }
        }
        

        this.recordedMatches.push(matchNumber)
        return true
    }
    
    getNextMatch(): DoubleEliminationMatch {
        
        if (this.scheduleIndex > 8||(this.scheduleIndex == 7 && this.netFinalWins != 0)) {
            bracketLogger.error("Cannot get next match, bracket is over")
            return
        }
        if (this.schedule[this.scheduleIndex].red == 0 || this.schedule[this.scheduleIndex].blue == 0) {
            bracketLogger.warn("Must update before requesting next match");
            return
        }
        bracketLogger.debug("CURRENT SCHEDULE", this.scheduleIndex, "SCHED", this.schedule[this.scheduleIndex], "DONE")
        this.scheduleIndex++;
        return this.schedule[this.scheduleIndex-1];
    }
            
    getCurrentMatch() {
        return this.schedule[this.scheduleIndex];
    }
}
        