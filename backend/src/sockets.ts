import { MatchState, type ClientToServerEvents, type ExtendedMatch, type PartialMatch, type ServerToClientEvents, MatchPeriod } from '@fowltypes';
import * as http from "http";
import { Server } from "socket.io";
import consts from "../secrets.json";
import matchmanager from "./matchmanager";
import { getMatchPeriod } from '@fowlutils/match_timer';


let io:Server<ClientToServerEvents,ServerToClientEvents> 

export default function startServer(server:http.Server) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket) => {
        if (socket.handshake.auth.key !== consts.socket.key) {
            socket.disconnect(true)
        }
        socket.emit("loadMatch", matchmanager.getCurrentMatch().getData())
        socket.emit("preloadMatch", matchmanager.getPreloadMatch().getData())
        
        const matches:{[key:string]:ExtendedMatch} = {}
        Object.entries(matchmanager.getMatches()).forEach(([key, match]) => {matches[key] = match.getData()});
        socket.emit("matches", matches)
        
        socket.on("preloadMatch", (id:string) => {
            const match = matchmanager.setPreloadMatch(id)
            console.log(id, match.id)
            match.state = MatchState.PRELOADED
            io.emit("preloadMatch", match.getData())
        })

        socket.on("loadMatch", (id:string) => {
    
            const match = matchmanager.setLoadedMatch(id)
            console.log(match.id)
            match.state = MatchState.LOADED
            io.emit("loadMatch", match.getData())
        })

        socket.emit("syncTime", Date.now()) // Account for time zone differences
        socket.on("partialMatch", (data:PartialMatch) => {
            if (!data.id) {console.warn("recieved bad match data", data);return}
            let match = matchmanager.updateMatch(data)
            if (match != null) {
                io.emit("match", match.getData())
            }
        })

        socket.on("startMatch", (id) => {
            const match = matchmanager.getCurrentMatch()
            if (id != match.id) {console.warn("Started non-loaded match");return;}
            match.startTime = Date.now();
            match.state = MatchState.IN_PROGRESS
            // TODO: NOTIFY IPC
            io.emit("match", match.getData())
        })
        socket.on("abortMatch", (id) => {
            const match = matchmanager.getCurrentMatch()
            console.log("aborting", id)
            if (id != match.id) {console.warn("Aborted non-loaded match");return;}
            match.startTime = 0;
            match.state = MatchState.LOADED
            // TODO: NOTIFY IPC
            io.emit("abortMatch", match.getData())
        })

        socket.on("commitMatch", (id) => {
            const match = matchmanager.getMatch(id)
            matchmanager.getMatch(id).state = MatchState.POSTED
            // TODO: Actually commit
            io.emit("match", match.getData())
        })

    })
    
}

setInterval(() => {
    if (!matchmanager.isDBLoaded()) {return;}
    const match = matchmanager.getCurrentMatch()
    if (getMatchPeriod((Date.now()-match.startTime)/1000) == MatchPeriod.POSTMATCH && match.state == MatchState.IN_PROGRESS) {
        match.state = MatchState.COMPLETE;
    }
    io.emit("match", match.getData())
}, 50)



