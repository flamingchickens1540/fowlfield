import {Match, Team} from "@prisma/client";


type PartialWithFields<T, F extends keyof T> = Pick<T, F> & Partial<T>


export type PartialMatch = PartialWithFields<Match, "id">
export type PartialTeam = PartialWithFields<Team, "number">

export interface EventInfo {
    atLunch:boolean
    lunchReturnTime:number
}

export interface TeamMatchStats {
    win:number
    loss:number
    tie:number
    rp:number
    avg_score:number
}

export interface ExtendedTeam extends Team {
    matchStats: TeamMatchStats
}

export enum MatchPeriod {
    PREMATCH="pre",
    AUTO="auto",
    PAUSE="pause",
    TELEOP="teleop",
    POSTMATCH="post"
}



export type MatchID = `${"qm"|"qf"|"sf"|"f"}${number}m${number}`
