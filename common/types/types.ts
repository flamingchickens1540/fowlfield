import { Match, PlayoffAlliance, Team } from '@prisma/client'

export type RobotPosition = 'red1' | 'red2' | 'red3' | 'blue1' | 'blue2' | 'blue3'
type PartialWithFields<T, F extends keyof T> = Pick<T, F> & Partial<T>

export type PartialMatch = PartialWithFields<Match, 'id'>
export type PartialTeam = PartialWithFields<Team, 'id'>
export type PartialAlliance = PartialWithFields<PlayoffAlliance, 'seed'>
export type AlliancePosition = Exclude<keyof PlayoffAlliance, 'seed'>

export type ToteKey = `tote${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`
export interface EventInfo {
    atLunch: boolean
    lunchReturnTime: number
}

export enum MatchState {
    PENDING = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETE = 'ended',
    POSTED = 'posted'
}
export interface TeamMatchStats {
    count: number
    win: number
    loss: number
    tie: number
    rp: number
    dq: number
    avg_coop: number
    avg_score: number
}

export interface ExtendedTeam extends Team {
    matchStats: TeamMatchStats
}

export type MatchID = `qm${number}` | `${MatchPrefix}${number}m${number}`
export type MatchPrefix = 'qm' | 'qf' | 'sf' | 'f'

export type RankingEntry = {
    team: number
    match_stats: TeamMatchStats
}

export enum MatchSound {
    START = 'start',
    TELEOP = 'teleop',
    END = 'end',
    ABORT = 'abort'
}

export type MatchPropertyKey<K extends keyof Match, L extends keyof Match[K], M extends keyof Match[K][L]> = [K] | [K, L] | [K, L, M]
