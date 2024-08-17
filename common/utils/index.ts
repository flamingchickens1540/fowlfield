import { Match } from '@prisma/client'
import { MatchPrefix } from '../types'
import { getBracketInfo } from './elims_bracket'

export function average(values: number[]) {
    if (values.length == 0) {
        return 0
    }
    let sum = 0
    values.forEach((value) => (sum += value))
    return sum / values.length
}

export function getCompLevel(match: Match): MatchPrefix {
    if (match.type == 'qualification') {
        return 'qm'
    }
    if (match.elim_info?.round == 4) {
        return 'qf'
    }
    if (match.elim_info?.round == 2) {
        return 'sf'
    }
    if (match.elim_info?.round == 1) {
        return 'f'
    }
    console.warn('Unknown match type!')
    return 'qm'
}

export function getMatchTitle(match: Match): string {
    const compLevel = getCompLevel(match)
    const { round, group, instance } = match.elim_info ?? {
        round: 0,
        group: 0,
        instance: 0
    }
    if (compLevel == 'qm') {
        return `Quals ${match.stage_index}`
    }
    if (compLevel == 'f') {
        return `Finals ${instance}`
    }
    return `Match ${match.stage_index}`
}

export function getMatchTitleLong(match: Match): string {
    const compLevel = getCompLevel(match)
    if (match.type == 'qualification') {
        return `Qualifications ${match.stage_index}`
    }
    const elimInfo = getBracketInfo(match)!
    if (compLevel == 'f') {
        return `Finals ${elimInfo.elimInstance}`
    }
    return `${elimInfo.isUpper ? 'Upper' : 'Lower'} Bracket Round ${elimInfo.elimRound} - Match ${elimInfo.elimInstance}`
}

export function safeParseInt(value: number): number
export function safeParseInt(value: string | null | undefined): number | undefined
export function safeParseInt(value: number | string | null | undefined): number | undefined {
    if (value == null) {
        return
    }
    if (typeof value == 'string') {
        const parsed = parseInt(value)
        return isNaN(parsed) ? undefined : parsed
    }
    return value
}
