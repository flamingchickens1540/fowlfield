import { Match, Team } from '@prisma/client'

export type RobotPosition =
    | 'red1'
    | 'red2'
    | 'red3'
    | 'blue1'
    | 'blue2'
    | 'blue3'
type PartialWithFields<T, F extends keyof T> = Pick<T, F> & Partial<T>

export type PartialMatch = PartialWithFields<Match, 'id'>
export type PartialTeam = PartialWithFields<Team, 'id'>

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
    avg_score: number
}

export interface ExtendedTeam extends Team {
    matchStats: TeamMatchStats
}

export type MatchID = `${MatchPrefix}${number}m${number}`
export type MatchPrefix = 'qm' | 'qf' | 'sf' | 'f'

export type RankingEntry = {
    team: number
    match_stats: TeamMatchStats
}
