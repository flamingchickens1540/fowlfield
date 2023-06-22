import type { Server, Socket } from "socket.io";
import { ExtendedMatch, PartialMatch } from "./types";


export interface ServerToClientEvents {
    match: (data:ExtendedMatch) => void
    matches: (data:ExtendedMatch[]) => void
    /**
     * Switches the client to the given match
     * @param data The match data
     * @returns 
     */
    setMatch: (data:ExtendedMatch) => void
}

export interface ClientToServerEvents {
    partialMatch: (data:PartialMatch) => void
}

export type ThisSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type ThisServer = Server<ClientToServerEvents, ServerToClientEvents>;