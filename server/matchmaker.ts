import {DoubleEliminationBracket} from "./doubleEliminationBracket";
import {DBMatch} from "./models/matches";
import {matchmanager, teammanager} from "~/managers";
import {calculatePointsTotal, getWinner} from "~common/utils/scores";
import {getBlankScoreBreakdown} from '~common/utils/blanks';
import {createLogger} from "~/logger";
import {Match} from "@prisma/client";
import prisma from "~/models/db";

const logger = createLogger("MatchMaker")

export class MatchMaker {
    private bracket: DoubleEliminationBracket | null = null;
    private latestQualsMatch = 0;

    constructor() {
        this.buildBracket()
    }

    async buildBracket() {
        const matches = await prisma.match.findMany()
        let elimMatches: Match[] = []
        matches.forEach((match) => {
            if (match.type == "qualification") {
                if (match.stage_index > this.latestQualsMatch) {
                    this.latestQualsMatch = match.stage_index;
                }
            } else {
                elimMatches.push(match)
            }
        });

        this.initElims(elimMatches.length);
        elimMatches.forEach((match) => {
            if (match.state == "ended" || match.state == "posted") {
                this.bracket.update(
                    match.stage_index,
                    getWinner(match)
                );
            }
        });
    }

    async advanceQualsMatch(): Promise<Match> {
        this.latestQualsMatch++;
        return prisma.match.create({
            data: {
                id: `qm${this.latestQualsMatch}`,
                stage_index: this.latestQualsMatch,
                type: "qualification",
                state: "not_started",
                startTime: new Date(0),
                red1: 0,
                red2: 0,
                red3: 0,
                blue1: 0,
                blue2: 0,
                blue3: 0,
                red_scores: getBlankScoreBreakdown(),
                blue_scores: getBlankScoreBreakdown(),
            }
        });
    }

    advanceElimMatch(): Promise<Match> {
        if (this.bracket == null) {
            logger.error("Must initialize elims before advancing");
            return
        }

        let match = this.bracket.getNextMatch();
        if (match == null) {
            return null
        }
        const alliances = teammanager.getAlliances()
        logger.info("ELIM DATA", match, match.red, match.blue, alliances)
        return prisma.match.create({data:{
            id: match.matchId,
            stage_index: match.matchNumber,
            elim_info: {
                round: match.elimRound,
                group: match.elimGroup,
                instance: match.elimInstance,
                red_alliance: match.red,
                blue_alliance: match.blue
            },
            type: "elimination",
                state: "not_started",
            red1: alliances[match.red][0] ?? 0,
            red2: alliances[match.red][1] ?? 0,
            red3: alliances[match.red][2] ?? 0,
            blue1: alliances[match.blue][0] ?? 0,
            blue2: alliances[match.blue][1] ?? 0,
            blue3: alliances[match.blue][2] ?? 0,
            red_scores: getBlankScoreBreakdown(),
            blue_scores: getBlankScoreBreakdown(),
            startTime: new Date(0),

        }});
    }


    initElims(currentmatch: number) {
        this.bracket = new DoubleEliminationBracket(currentmatch);
    }

    /**
     *
     * @param match
     * @warning MATCH CANNOT END IN A TIE
     */
    updateBracket(match: Match) {
        if (match.type == "elimination") {
            const didUpdateSucceed = this.bracket?.update(
                match.stage_index,
                getWinner(match)
            );
            if (!didUpdateSucceed) {
                logger.warn("rebuilding bracket")
                this.buildBracket()
            }
        }
    }
}
    