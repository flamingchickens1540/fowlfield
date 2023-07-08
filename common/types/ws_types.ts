import type { IPCData } from "./ipctypes";
import type {
    DSStatuses,
    DriverStation,
    ExtendedTeam,
    MatchData,
    PartialMatch,
    PartialTeam,
    StackLightColor,
    StackLightState,
    TeamData,
} from ".";

export interface ServerToClientEvents {
    match(data: MatchData): void;
    matches(data: { [key: string]: MatchData }): void;
    team(data: ExtendedTeam): void;
    teams(data: { [key: string]: ExtendedTeam }): void;
    /**
     *
     * @param time the current server-side time (ms)
     * @returns
     */
    syncTime(time: number): void;
    /**
     * Update displays that are used before the match
     */
    preloadMatch(data: MatchData): void;
    /**
     * Update displays that are used during and after the match
     */
    loadMatch(matdatach: MatchData): void;
    abortMatch(data: MatchData): void;
    dsStatus(data:DSStatuses):void
    alert(message:string):void
    queryEstop(cb:(data:Partial<{[key in DriverStation]:boolean}>)=>void)
    setLight(color:StackLightColor, state:StackLightState)
}

export interface ClientToServerEvents {
    partialMatch(data: PartialMatch): void;
    partialTeam(data: PartialTeam): void;

    newTeam(data: TeamData): void;
    deleteTeam(id:number): void;
    /*
    Update displays that are used before the match
    */
    preloadMatch(id: string): void;
    /*
    Update displays that are used during and after the match
    */
    loadMatch(id: string): void;
    abortMatch(id: string): void;
    startMatch(id: string): void;
    commitMatch(id: string): void;

    nextMatch(type:"qualification"|"elimination"):void
    estop(station:DriverStation):void
}
