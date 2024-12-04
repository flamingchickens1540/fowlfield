import { DoubleEliminationBracket } from './doubleEliminationBracket'
import { teammanager } from '~/managers'
import { getWinner } from '~common/utils/scores'
import { getBlankMatchScoreBreakdown } from '~common/utils/blanks'
import { createLogger } from '~/logger'
import { Match } from '@prisma/client'
import prisma from '~/managers/db'

const logger = createLogger('MatchMaker')

export class MatchMaker {
    private bracket: DoubleEliminationBracket | null = null
    private latestQualsMatch = 0

    constructor() {
        this.buildBracket()
    }

    async buildBracket() {
        const matches = await prisma.match.findMany()
        let elimMatches: Match[] = []
        matches.forEach((match) => {
            if (match.type == 'qualification') {
                if (match.stage_index > this.latestQualsMatch) {
                    this.latestQualsMatch = match.stage_index
                }
            } else {
                elimMatches.push(match)
            }
        })

        this.initElims(elimMatches.length)

        elimMatches.forEach((match) => {
            if (match.state == 'ended' || match.state == 'posted') {
                const winner = getWinner(match)
                if (winner != 'tie') {
                    this.bracket.update(match.stage_index, winner)
                }
            }
        })
    }

    async advanceQualsMatch(): Promise<Match> {
        this.latestQualsMatch++
        return prisma.match.create({
            data: {
                id: `qm${this.latestQualsMatch}`,
                stage_index: this.latestQualsMatch,
                type: 'qualification',
                state: 'not_started',
                startTime: 0,
                red1: 0,
                red2: 0,
                red3: 0,
                blue1: 0,
                blue2: 0,
                blue3: 0,
                scores: getBlankMatchScoreBreakdown()
            }
        })
    }

    async advanceElimMatch(): Promise<Match> {
        if (this.bracket == null) {
            logger.error('Must initialize elims before advancing')
            return
        }

        let match = this.bracket.getNextMatch()
        if (match == null) {
            return null
        }
        const alliances = await teammanager.getAlliances()
        logger.info({ match, alliances }, 'ELIM DATA')
        const red = alliances.get(match.red)
        const blue = alliances.get(match.blue)
        return prisma.match.create({
            data: {
                id: match.details.matchId,
                stage_index: match.details.matchNumber,
                elim_info: {
                    round: match.details.elimRound,
                    group: match.details.elimGroup,
                    instance: match.details.elimInstance,
                    red_alliance: match.red,
                    blue_alliance: match.blue
                },
                type: 'elimination',
                state: 'not_started',
                red1: red.captain ?? 0,
                red2: red.first_pick ?? 0,
                red3: red.second_pick ?? 0,
                blue1: blue.captain ?? 0,
                blue2: blue.first_pick ?? 0,
                blue3: blue.second_pick ?? 0,
                scores: getBlankMatchScoreBreakdown(),
                startTime: 0
            }
        })
    }

    initElims(currentmatch: number) {
        this.bracket = new DoubleEliminationBracket(currentmatch)
    }

    /**
     *
     * @param match
     * @warning MATCH CANNOT END IN A TIE
     */
    async updateBracket(match: Match) {
        if (match.type == 'elimination') {
            const winner = getWinner(match)
            if (winner == 'tie') {
                logger.error('Match cannot end in a tie')
                return
            }
            const didUpdateSucceed = this.bracket?.update(match.stage_index, winner)
            if (!didUpdateSucceed) {
                logger.warn('rebuilding bracket')
                await this.buildBracket()
            }
        }
    }
}
