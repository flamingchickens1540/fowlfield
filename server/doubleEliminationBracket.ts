import { createLogger } from '~/logger'
import { DoubleEliminationMatch, schedule } from '~common/utils/elims_bracket'

const bracketLogger = createLogger('bracket', { level: 'debug' })
export type DoubleEliminationAlliance = 1 | 2 | 3 | 4

type ScheduleItem = {
    red?: DoubleEliminationAlliance
    blue?: DoubleEliminationAlliance
    details: DoubleEliminationMatch
}

export class DoubleEliminationBracket {
    private matches: { [key: number]: ScheduleItem } = {}
    private scheduleIndex = 1
    private netFinalWins = 0

    constructor(currentmatch: number) {
        this.scheduleIndex = currentmatch + 1
        Object.entries(schedule).forEach(([key, value]) => {
            this.matches[parseInt(key)] = { details: value }
        })

        this.matches[1].red = 1
        this.matches[1].blue = 4
        this.matches[2].red = 2
        this.matches[2].blue = 3
    }
    private recordedMatches = []

    update(matchNumber: number, winner: 'red' | 'blue'): boolean {
        bracketLogger.debug('recording match', matchNumber)
        //the logic to make double elimination work
        if (this.recordedMatches.includes(matchNumber)) {
            bracketLogger.warn('already recorded', matchNumber)
            return false
        }
        const match: ScheduleItem = this.matches[matchNumber]

        const winningAlliance = winner === 'red' ? match.red : match.blue
        const losingAlliance = winner === 'red' ? match.blue : match.red

        if (match.details.winnerTo != null) {
            this.matches[match.details.winnerTo.match][match.details.winnerTo.alliance] = winningAlliance
        }
        if (match.details.loserTo != null) {
            this.matches[match.details.loserTo.match][match.details.loserTo.alliance] = losingAlliance
        }
        switch (matchNumber) {
            case 6: {
                //finals 1
                this.matches[7].red = match.red
                this.matches[7].blue = match.blue
                this.netFinalWins += winner === 'red' ? 1 : -1
                break
            }
            case 7: {
                //finals 2
                this.matches[8].red = match.red
                this.matches[8].blue = match.blue
                this.netFinalWins += winner === 'red' ? 1 : -1
                break
            }
        }

        this.recordedMatches.push(matchNumber)
        return true
    }

    getNextMatch(): ScheduleItem {
        if (this.isOver()) {
            bracketLogger.error(this, 'Cannot get next match, bracket is over')
            return
        }
        if (this.matches[this.scheduleIndex].red == null || this.matches[this.scheduleIndex].blue == null) {
            bracketLogger.warn('Must update before requesting next match')
            return
        }
        bracketLogger.debug('CURRENT SCHEDULE', this.scheduleIndex, 'SCHED', this.matches[this.scheduleIndex], 'DONE')
        this.scheduleIndex++
        return this.matches[this.scheduleIndex - 1]
    }

    getCurrentMatch(): ScheduleItem {
        return this.matches[this.scheduleIndex]
    }

    isOver(): boolean {
        return this.scheduleIndex > 8 || (this.scheduleIndex == 8 && this.netFinalWins != 0)
    }
    getFinalMatch(): ScheduleItem | undefined {
        if (!this.isOver()) {
            return
        }
        return this.matches[this.scheduleIndex - 1]
    }
}
