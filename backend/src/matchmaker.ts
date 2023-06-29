import { MatchData, MatchState } from "@fowltypes";
import { DoubleEliminationBracket } from "./doubleEliminationBracket";
import { getMatches } from "./models/db";
import { DBMatch } from "./models/matches";
import * as matchmanager from "./matchmanager"
import * as teammanager from './teammanager';


export class MatchMaker {
    private bracket: DoubleEliminationBracket | null = null;
    private matchNum = 0;
    
    constructor() {
        const matches = matchmanager.getMatches()
        let elimMatches:MatchData[] = []
        Object.values(matches)
        .forEach((match) => {
            if (match.type == "qualification") {
                if (match.matchNumber > this.matchNum) {
                    this.matchNum = match.matchNumber;
                }
            } else {
                elimMatches.push(match)
            }
        });

        this.initElims(elimMatches.length);
        elimMatches.forEach((match) => {
            if (match.state == MatchState.COMPLETE || match.state == MatchState.POSTED) {
            this.bracket.update(
                match.matchNumber,
                match.redScore > match.blueScore ? "red" : "blue"
                );
            }
            });
    }
    
    advanceQualsMatch(): DBMatch {
        this.matchNum++;
        return matchmanager.newMatch({
            id: `QM${this.matchNum}`,
            matchNumber: this.matchNum,
            elimRound: 0,
            elimGroup: 0,
            elimInstance: 0,
            type: "qualification",
            red1: 0,
            red2: 0,
            red3: 0,
            blue1: 0,
            blue2: 0,
            blue3: 0,
            redScore: 0,
            blueScore: 0,
            startTime: 0,
            redAlliance:0,
            blueAlliance:0,
            state:MatchState.PENDING
        });
    }
    
    advanceElimMatch(): DBMatch {
        if (this.bracket == null) {console.error("Must initialize elims before advancing");return}
        
        let match = this.bracket.getNextMatch();
        if (match == null) {return null}
        const alliances = teammanager.getAlliances()
        console.log(match, match.red, match.blue, alliances)
        return matchmanager.newMatch({
            id: match.matchId,
            matchNumber: match.matchNumber,
            elimRound: match.elimRound,
            elimGroup: match.elimGroup,
            elimInstance: match.elimInstance,
            type: "elimination",
            red1: alliances[match.red][0] ?? 0,
            red2: alliances[match.red][1] ?? 0,
            red3: alliances[match.red][2] ?? 0,
            blue1: alliances[match.blue][0] ?? 0,
            blue2: alliances[match.blue][1] ?? 0,
            blue3: alliances[match.blue][2] ?? 0,
            redScore: 0,
            blueScore: 0,
            startTime: 0,
            redAlliance:match.red,
            blueAlliance:match.blue,
            state:MatchState.PENDING
        });
    }

    
    initElims(currentmatch) {
        this.bracket = new DoubleEliminationBracket(currentmatch);
    }
        
    /**
    *
    * @param match
    * @warning MATCH CANNOT END IN A TIE
    */
    updateBracket(match: MatchData) {
        if (match.type == "elimination") {
            this.bracket?.update(
                match.matchNumber,
                match.redScore > match.blueScore ? "red" : "blue"
                );
            }
        }
    }
    