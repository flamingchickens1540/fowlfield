import type { IPCData, Match, Team } from "./ipctypes"


export type DriverStation = "R1"| "R2" | "R3" | "B1" | "B2" | "B3"

export type PartialMatch = Pick<MatchData, "id"> & Partial<MatchData>
export type PartialTeam = Pick<TeamData, "id"> & Partial<TeamData>
export interface MatchData extends Match {
    redScore:number
    blueScore:number,
    redAlliance:number,
    blueAlliance:number,
    startTime:number,
    state:MatchState
}



export interface TeamData extends Team {
    name:string
    displaynum:string
    robotname?:string
    alliance:0|1|2|3|4
    alliancePosition:0|1|2|3|4
}
export interface TeamMatchStats {
    win:number
    loss:number
    tie:number
    rp:number
    avg_score:number
}

export interface ExtendedTeam extends TeamData {
    // matches:string[]
    matchStats: TeamMatchStats
}


export enum MatchState {
    PENDING = "pending",
    IN_PROGRESS = "progress",
    COMPLETE = "completed",
    POSTED = "posted",
}
export enum MatchPeriod {
    PREMATCH="pre",
    AUTO="auto",
    PAUSE="pause",
    TELEOP="teleop",
    POSTMATCH="post"
}



export type DSStatuses = IPCData["ds_status"]


export type MatchID = `${"qm"|"qf"|"sf"|"f"}${number}m${number}`
