import rootLogger from "logger";
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
};



export class DoubleEliminationBracket {
    private schedule: DoubleEliminationMatch[] = [
        {
            matchNumber: 1,
            matchId: "qf1m1",
            elimRound: 4,
            elimGroup: 1,
            elimInstance: 1,
            red: 0,
            blue: 0,
        },
        {
            matchNumber: 2,
            matchId: "qf2m1",
            elimRound: 4,
            elimGroup: 2,
            elimInstance: 1,
            red: 0,
            blue: 0,
        },
        {
            matchNumber: 3,
            matchId: "qf3m1",
            elimRound: 4,
            elimGroup: 3,
            elimInstance: 1,
            red: 0,
            blue: 0,
        },
        {
            matchNumber: 4,
            matchId: "sf1m1",
            elimRound: 2,
            elimGroup: 1,
            elimInstance: 1,
            red: 0,
            blue: 0,
        },
        {
            matchNumber: 5,
            matchId: "sf1m2",
            elimRound: 2,
            elimGroup: 2,
            elimInstance: 1,
            red: 0,
            blue: 0,
        },
        {
            matchNumber: 6,
            matchId: "f1m1",
            elimRound: 1,
            elimGroup: 1,
            elimInstance: 1,
            red: 0,
            blue: 0,
        },
        {
            matchNumber: 7,
            matchId: "f1m2",
            elimRound: 1,
            elimGroup: 1,
            elimInstance: 2,
            red: 0,
            blue: 0,
        },
        {
            matchNumber: 8,
            matchId: "f1m3",
            elimRound: 1,
            elimGroup: 1,
            elimInstance: 3,
            red: 0,
            blue: 0,
        },
    ];
    private alliances: DoubleEliminationAlliance[] = [1,2,3,4];
    private scheduleIndex = 0;
    private netFinalWins = 0;
    
    constructor(currentmatch) {
        this.scheduleIndex=currentmatch
        this.schedule[0].red = this.alliances[0];
        this.schedule[0].blue = this.alliances[3];
        this.schedule[1].red = this.alliances[1];
        this.schedule[1].blue = this.alliances[2];
    }
    private recordedMatches = []

    update(matchNumber: number, winner: "red" | "blue") {
        bracketLogger.debug("recording match", matchNumber)
        //the logic to make double elimination work
        if (this.recordedMatches.includes(matchNumber)) {bracketLogger.warn("already recorded", matchNumber); return}
        const match = this.schedule[matchNumber - 1]
        
        const winningAlliance = winner === "red" ? match.red : match.blue;
        const losingAlliance  = winner === "red" ? match.blue : match.red;
        switch (matchNumber - 1) {
            case 0: { // qf1m1
                this.schedule[3].red = winningAlliance //sf1m1
                this.schedule[2].red = losingAlliance //qf3m1
                break;
            }
            case 1: { // qf2m1
                this.schedule[3].blue = winningAlliance //sf1m1
                this.schedule[2].blue = losingAlliance //qf3m1
                break;
            }
            case 2: { // qf3m1
                this.schedule[4].blue = winningAlliance  // sf1m2
                break;
            }
            case 3: {
                this.schedule[5].red = winningAlliance // finals
                this.schedule[4].red = losingAlliance  // sf1m2
                break;
            }
            case 4: {
                this.schedule[5].blue = winningAlliance // finals
                break;
            }
            case 5: {
                //finals 1
                this.schedule[6].red = match.red;
                this.schedule[6].blue = match.blue;
                this.netFinalWins += winner === "red" ? 1 : -1;
                break;
            }
            case 6: {
                //finals 2
                this.schedule[7].red = match.red;
                this.schedule[7].blue = match.blue;
                this.netFinalWins += winner === "red" ? 1 : -1;
                break;
            }
            case 7: {
                //finals 3
                this.schedule[8].red = match.red;
                this.schedule[8].blue = match.blue;
                break;
            }
        }
        

        this.recordedMatches.push(matchNumber)
    }
    
    getNextMatch(): DoubleEliminationMatch {
        
        if (this.scheduleIndex >= this.schedule.length ||(this.scheduleIndex == 6 && this.netFinalWins != 0)) {
            bracketLogger.error("Cannot get next match, bracket is over")
            return
        }
        if (this.schedule[this.scheduleIndex].red == 0 || this.schedule[this.scheduleIndex].blue == 0) {
            bracketLogger.warn("Must update before requesting next match");
            return
        }
        bracketLogger.debug("CURRENT SCHEDULE", this.scheduleIndex, this.schedule[this.scheduleIndex])
        this.scheduleIndex++;
        return this.schedule[this.scheduleIndex-1];
    }
            
    getCurrentMatch() {
        return this.schedule[this.scheduleIndex];
    }
}
        