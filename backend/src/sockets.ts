import { MatchState, type ClientToServerEvents, type MatchData, type PartialMatch, type ServerToClientEvents, MatchPeriod, PartialTeam, TeamData, ExtendedTeam, IPCData, DSStatuses, DriverStation } from '@fowltypes';
import * as http from "http";
import { Server } from "socket.io";
import consts from "../secrets.json";
import * as matchmanager from "./matchmanager";
import { getMatchPeriod } from '@fowlutils/match_timer';
import * as teammanager from './teammanager';
import { buildStats } from 'models/teams';
import { getDsStatus } from 'index';
import { IPCClient } from 'ipc/ipc';
import logger from "./logger"

const matchLogger = logger.getLogger("match")

let io: Server<ClientToServerEvents, ServerToClientEvents>



export default function startServer(server: http.Server, ipc:IPCClient) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    })
    const estopHandler = (station:DriverStation) => {
        ipc.estop(station)
        logger.log("estopping", station)
    }
    
    
    io.on("connection", (socket) => {
        
        if (socket.handshake.auth.key !== consts.socket.key) {
            socket.disconnect(true)
            return;
        }
        if ((socket.handshake.auth.role ?? "") == "estop") {
            socket.join("estop")
        }
        
        logger.debug("New connection from", socket.id, socket.handshake.address, socket.handshake.url)
        queryEstops()
        socket.emit("loadMatch", matchmanager.getCurrentMatch().getData())
        socket.emit("preloadMatch", matchmanager.getPreloadMatch().getData())
        
        const teams: { [key: number]: ExtendedTeam } = {}
        const matches: { [key: string]: MatchData } = {}
        
        Object.entries(teammanager.getTeams()).forEach(([key, team]) => {teams[key] = { 
            ...team.getData(), 
            matches: [], 
            matchStats: { win: 0, loss: 0, tie: 0, rp: 0 }
        }})
        Object.entries(matchmanager.getMatches()).forEach(([key, match]) => {
            matches[key] = match.getData()
            const matchteams = [match.red1, match.red2, match.red3, match.blue1, match.blue2, match.blue3]
            matchteams.forEach((team: number, index: number) => {
                if (teams[team] == null) {return}
                buildStats(match, index<3, teams[team].matchStats)
            })
        });
        socket.emit("matches", matches)
        socket.emit("teams", teams)
        socket.emit("dsStatus", getDsStatus())
        
        
        socket.on("preloadMatch", (id: string) => {
            matchLogger.log("preloading", id)
            const match = matchmanager.setPreloadMatch(id)
            io.emit("preloadMatch", match.getData())
        })
        
        socket.on("loadMatch", (id: string) => {
            matchLogger.log("loading", id)
            const match = matchmanager.setLoadedMatch(id)
            
            ipc.load(match.getData())
            queryEstops().then((didSucceed) => {if (!didSucceed) alert("Estop responses not received, check online")})
            io.emit("loadMatch", match.getData())
        })
        
        socket.emit("syncTime", Date.now()) // Account for time zone differences
        socket.on("partialMatch", async (data: PartialMatch) => {
            logger.debug("reciving match", data)
            if (!data.id) { logger.warn("recieved bad match data", data); return }
            let match = matchmanager.updateMatch(data)
            if (match != null) {
                io.emit("match", match.getData())
            }
            if (data.red1 != null && data.red1 != 0) { io.emit("team", await teammanager.getTeam(data.red1).getExtendedData()) }
            if (data.red2 != null && data.red2 != 0) { io.emit("team", await teammanager.getTeam(data.red2).getExtendedData()) }
            if (data.red3 != null && data.red3 != 0) { io.emit("team", await teammanager.getTeam(data.red3).getExtendedData()) }
            if (data.blue1 != null && data.blue1 != 0) { io.emit("team", await teammanager.getTeam(data.blue1).getExtendedData()) }
            if (data.blue2 != null && data.blue2 != 0) { io.emit("team", await teammanager.getTeam(data.blue2).getExtendedData()) }
            if (data.blue3 != null && data.blue3 != 0) { io.emit("team", await teammanager.getTeam(data.blue3).getExtendedData()) }
        })
        
        socket.on("partialTeam", async (data: PartialTeam) => {
            logger.debug("receiving team", data)
            if (!data.id) { logger.warn("received bad team", data); return }
            let team = teammanager.updateTeam(data)
            if (team != null) {
                io.emit("team", await team.getExtendedData())
            }
        })
        
        socket.on("deleteTeam", async (id:number) => {
            logger.log("deleting team", id)
            teammanager.deleteTeam(id)
            
            io.emit("teams", teammanager.buildExtendedTeams())
        })
        
        socket.on("newTeam", async (data: TeamData) => {
            logger.debug("receiving full team", data)
            if (!data.id) { logger.warn("received bad team", data); return }
            if (data.displaynum == "") {delete data.displaynum}
            if (data.name == "") {delete data.name}
            let team = teammanager.newTeam({
                id:data.id,
                displaynum:data.displaynum ?? data.id.toString(),
                alliance:data.alliance ?? 0,
                alliancePosition: data.alliancePosition ?? 0,
                name: data.name ?? "Team "+data.displaynum ?? data.id.toString(),
                robotname:data.robotname
            })
            if (team != null) {
                const extended = await team.getExtendedData()
                io.emit("team", extended)
            }
        })
        
        socket.on("startMatch", async (id) => {
            const match = matchmanager.getCurrentMatch()
            if (id != match.id) { alert("Attempted to start a non-loaded match"); return; }
            const areEstopsReady = await queryEstops()
            if (!areEstopsReady) {
                alert("Estop responses not received, check them")
                return;
            }
            match.startTime = Date.now();
            match.state = MatchState.IN_PROGRESS
            
            ipc.start(match.getData())
            ipc.awaitResponse(["matchhold", "matchconfirm"]).then((message) => {
                // if (message.cmd == "matchhold") {
                //     match.startTime = 0;
                //     match.state = MatchState.PENDING;
                //     alert("Match not ready")
                // } else {
                //     matchLogger.log(match.id, "start confirmed")
                // }
            }).catch((reason) => {
                alert("Did not recieve IPC response:", reason)
                match.startTime = 0;
                match.state = MatchState.PENDING;
            }).finally(() => {
                io.emit("match", match.getData())
            })
        })
        socket.on("abortMatch", (id) => {
            const match = matchmanager.getCurrentMatch()
            matchLogger.log("aborting", id)
            if (id != match.id) { alert("Aborted non-loaded match"); return; }
            match.startTime = 0;
            match.state = MatchState.PENDING
            ipc.abort()
            // TODO: NOTIFY IPC
            io.emit("abortMatch", match.getData())
        })
        
        socket.on("commitMatch", (id) => {
            const match = matchmanager.getMatch(id)
            match.state = MatchState.POSTED
            // TODO: Actually commit
            io.emit("match", match.getData())
        })
        
        socket.on("nextMatch", (type) => {
            const newmatch = matchmanager.advanceMatches(type)
            if (newmatch != null) {
                io.emit("match", newmatch.getData())
            }
        })
        
        socket.on("estop", estopHandler)
        
        function alert(...message:string[]) {
            matchLogger.warn("ALERT", ...message)
            socket.emit("alert", message.join(" "))
        }

        async function queryEstops():Promise<boolean> {
            const recieved = {
                "R1": false,
                "R2": false,
                "R3": false,
                "B1": false,
                "B2": false,
                "B3": false
            }
            let complete:(value:boolean) => void
            io.to("estop").timeout(300).emit("queryEstop", (err, [data]) => {
                if (data == null) {console.log("noresponse");return;}
                if (data.B1) {estopHandler("B1")}
                if (data.B2) {estopHandler("B2")}
                if (data.B3) {estopHandler("B3")}
                if (data.R1) {estopHandler("R1")}
                if (data.R2) {estopHandler("R2")}
                if (data.R3) {estopHandler("R3")}
                Object.keys(data).forEach((key) => recieved[key] =true)
                let allGood = true;
                Object.values(recieved).forEach((isStationRecieved) => {
                    if (!isStationRecieved) {allGood = false}
                })
                console.warn("recieved estops", Object.keys(data))
                if (allGood) {complete(true)}
            })
            const success:Promise<boolean> = new Promise((resolve, reject) => {
                complete = resolve;
            })
            const timeout:Promise<boolean> = new Promise((resolve, reject) => {
                setTimeout(() => resolve(false), 300);
            });

            return Promise.race([success,timeout])

            
        }
    })
    
    setInterval(() => {
        if (!matchmanager.isDBLoaded()) { return; }
        const match = matchmanager.getCurrentMatch()
        if (getMatchPeriod((Date.now() - match.startTime) / 1000) == MatchPeriod.POSTMATCH && match.state == MatchState.IN_PROGRESS) {
            match.state = MatchState.COMPLETE;
            matchLogger.log("Transitioning match", match.id, "to completed")
            io.emit("match", match.getData())
        }
    }, 50)
    
    return {
        emitDsStatus(statuses:DSStatuses) {
            io.emit("dsStatus", statuses)
        }
    }
    
}





