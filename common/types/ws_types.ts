import {
    EventInfo,
    ExtendedTeam,
    MatchData,
    PartialMatch,
    PartialTeam,
    TeamData,
} from ".";

export interface ServerToClientEvents {
    match(data: MatchData): void;
    matches(data: { [key: string]: MatchData }): void;
    team(data: ExtendedTeam): void;
    teams(data: { [key: string]: ExtendedTeam }): void;
    event(data: EventInfo): void;
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
    
    alert(message:string):void
}

export interface ClientToServerEvents {
    partialMatch(data: PartialMatch): void;
    partialTeam(data: PartialTeam): void;
    partialEvent(data: Partial<EventInfo>): void;

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
    resetMatch(id:string):void;

    nextMatch(type:string):void
    commitAlliances(cb:(ok:boolean) => void):void
}
