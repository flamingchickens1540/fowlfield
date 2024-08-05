import {EventInfo, ExtendedTeam, PartialMatch, PartialTeam,} from ".";
import { Match, Team } from '@prisma/client'

export interface ServerToClientEvents {
    match(data: Match): void;
    matches(data: Record<string, Match>): void;
    team(data: Team): void;
    teams(data: Record<string, Team>): void;
    event(data: EventInfo): void;

    /**
     * Update displays that are used before the match
     */
    preloadMatch(data: Match): void;
    /**
     * Update displays that are used during and after the match
     */
    loadMatch(data: Match): void;
    abortMatch(data: Match): void;
    
    alert(message:string):void

    login(payload:{success:boolean, token?:string}):void
}

export interface ClientToServerEvents {
    login(password:string):void
    ping(cb:(time:number)=>void):void

    partialMatch(data: PartialMatch): void;
    partialTeam(data: PartialTeam): void;
    partialEvent(data: Partial<EventInfo>): void;

    newTeam(data: Team): void;
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
