import type { Server, Socket } from "socket.io";
import type { ExtendedMatch, PartialMatch } from "./types";
import { abortMatch, startMatch, commitMatch } from '../../frontend/svelte/store';


export interface ServerToClientEvents {
    match: (data:ExtendedMatch) => void
    matches: (data:{[key:string]:ExtendedMatch}) => void
    /**
     * 
     * @param time the current server-side time (ms)
     * @returns 
     */
    syncTime: (time:number) => void
        /*
        Update displays that are used before the match
    */
        preloadMatch: (data:ExtendedMatch) => void
        /*
            Update displays that are used during and after the match
        */
        loadMatch: (matdatach:ExtendedMatch) => void
        abortMatch: (data:ExtendedMatch) => void;
}

export interface ClientToServerEvents {
    partialMatch: (data:PartialMatch) => void
    /*
        Update displays that are used before the match
    */
    preloadMatch: (id:string) => void
    /*
        Update displays that are used during and after the match
    */
    loadMatch: (id:string) => void
    abortMatch: (id:string) => void;
    startMatch: (id:string) => void;
    commitMatch: (id:string) => void;
}

export type ThisSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type ThisServer = Server<ClientToServerEvents, ServerToClientEvents>;