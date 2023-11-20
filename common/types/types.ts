import type { AllianceStationStatus, IPCData, Match, Team } from "./ipctypes"


export type DriverStation = "R1"| "R2" | "R3" | "B1" | "B2" | "B3"

export type PartialMatch = Pick<MatchData, "id"> & Partial<MatchData>
export type PartialTeam = Pick<TeamData, "id"> & Partial<TeamData>

export enum Card {
    NONE = "none",
    YELLOW = "yellow",
    RED = "red"
}
export interface MatchData extends Match {
    redAlliance:number,
    blueAlliance:number,
    blueScoreBreakdown:ScoreBreakdown
    redScoreBreakdown:ScoreBreakdown
    startTime:number,
    state:MatchState
    redCards:[Card,Card,Card]
    blueCards:[Card,Card,Card]
}

export interface ScoreBreakdown {
    autoBunnyCount:number,
    finalBunnyCount:number,
    autoTaxiBonus: [boolean, boolean, boolean]
    targetHits: [number, number, number], // These are times this alliance hit an opponent robot
    fouls: Foul[] // These are fouls committed by the other alliance, they represent points to be added to this alliance
    endgameParkBonus: [boolean, boolean, boolean]
}

export interface Foul {
    timestamp:number
    robot:number
    value:number
}


export interface EventInfo {
    atLunch:boolean
    lunchReturnTime:number
}

export type RobotHitState = {
    count: 0|1|2|3
    lastDisable: number
}

export interface TeamData extends Team {
    name:string
    displaynum:string
    robotname?:string
    alliance:0|1|2|3|4
    alliancePosition:0|1|2|3|4
    card:Card
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



export type DSStatuses = { [key in DriverStation]: AllianceStationStatus}

export type ExtendedDsStatus = DSStatuses[DriverStation]& {
    hardwareEstopPressed:boolean
    hardwareEstopOnline:boolean
}
export type ExtendedDsStatuses = {[key in DriverStation]:DSStatuses[key]& ExtendedDsStatus}


export type MatchID = `${"qm"|"qf"|"sf"|"f"}${number}m${number}`
