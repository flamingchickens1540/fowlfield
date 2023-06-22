import type { Match } from "./ipctypes"


export type DriverStation = "R1"| "R2" | "R3" | "B1" | "B2" | "B3"

export type PartialMatch = Pick<ExtendedMatch, "id"> & Partial<ExtendedMatch>

export interface ExtendedMatch extends Match {
    redScore:number
    blueScore:number
    startTime:number
}

export enum MatchPeriod {
    PREMATCH="pre",
    AUTO="auto",
    PAUSE="pause",
    TELEOP="teleop",
    POSTMATCH="post"
}