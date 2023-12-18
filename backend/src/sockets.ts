import {
    BucketPattern,
    Card,
    type ClientToServerEvents,
    DriverStation,
    ExtendedDsStatuses,
    ExtendedTeam,
    type MatchData,
    MatchPeriod,
    MatchState,
    type PartialMatch,
    PartialTeam,
    RobotHitState,
    type ServerToClientEvents,
    StackLightColor,
    StackLightState,
    TeamData
} from '@fowltypes';
import * as http from "http";
import {Server} from "socket.io";
import consts from "../secrets.json";
import * as matchmanager from "./managers/matchmanager";
import {getMatchPeriod} from '@fowlutils/match_timer';
import * as teammanager from './managers/teammanager';
import {buildStats} from 'models/teams';
import {getDsStatus, isProduction} from 'index';
import logger from "./logger"
import {isMatchReady, probeEstops} from 'managers/statusmanager';
import {handleEstop} from './managers/statusmanager';
import {instrument} from "@socket.io/admin-ui"
import {DBSettings} from 'models/settings';
import {bucketmanager, hitmanager} from 'managers';

import * as tba from "./tba/index";
import {getBlankScoreBreakdown} from "@fowlutils/blanks";

const matchLogger = logger.getLogger("match")
let io: Server<ClientToServerEvents, ServerToClientEvents>


export default function startServer(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    if (!isProduction) {
        console.log("starting admin server")
        instrument(io, {
            auth: {
                type: "basic",
                username: "admin",
                password: "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS" // "changeit" encrypted with bcrypt
            },
            mode: "development"
        })
    }


    io.on("connection", (socket) => {
        
        if (socket.handshake.auth?.key?.trim() !== consts.socket.key) {
            socket.disconnect(true)
            logger.log("unauthorized connection from", socket.handshake.address, socket.handshake.url, socket.handshake.auth)
            return;
        }
        logger.log("new connection from", socket.id, socket.handshake.address, socket.handshake.auth.role ?? "default")

        if ((socket.handshake.auth.role ?? "") == "estop") {
            socket.join("estop")
            probeEstops()
        } else if ((socket.handshake.auth.role ?? "") == "light") {
            socket.join("light")
        } else if ((socket.handshake.auth.role ?? "") == "robot") {
            socket.join("robot")
            const robot_id = socket.handshake.auth.robot_id
            if (robot_id == null) {
                logger.warn("Robot attempted to connect without robot_id", socket.handshake.auth)
                socket.disconnect(true)
                return;
            }

            if (!["R1", "R2", "R3", "B1", "B2", "B3"].includes(robot_id)) {
                logger.warn("Robot attempted to connect without valid robot_id", socket.handshake.auth)
                socket.disconnect(true)
                return;
            }
            bucketmanager.registerBucket(robot_id, socket)
        } else {
            socket.join("dashboard")

            const teams: { [key: number]: ExtendedTeam } = {}
            const matches: { [key: string]: MatchData } = {}

            Object.entries(teammanager.getTeams()).forEach(([key, team]) => {
                teams[key] = {
                    ...team.getData(),
                    matches: [],
                    matchStats: { win: 0, loss: 0, tie: 0, rp: 0 }
                }
            })
            Object.entries(matchmanager.getMatches()).forEach(([key, match]) => {
                matches[key] = match.getData()
                const matchteams = [match.red1, match.red2, match.red3, match.blue1, match.blue2, match.blue3]
                matchteams.forEach((team: number, index: number) => {
                    if (teams[team] == null) { return }
                    const isRed = index < 3
                    const dq = (isRed ? match.redCards : match.blueCards)[index % 3] == Card.RED
                    buildStats(match, isRed, dq, teams[team].matchStats)
                })
            });

            // Send initial data
            socket.emit("loadMatch", matchmanager.getCurrentMatch().getData())
            socket.emit("preloadMatch", matchmanager.getPreloadMatch().getData())
            socket.emit("matches", matches)
            socket.emit("teams", teams)
            socket.emit("dsStatus", getDsStatus())
            socket.emit("syncTime", Date.now()) // Account for time zone differences
            DBSettings.getInstance().then((settings) => {
                socket.emit("event", {
                    atLunch: settings.atLunch,
                    lunchReturnTime: settings.lunchReturnTime
                })
            })
        }

        





        socket.on("commitAlliances", async (cb) => {
            cb(await tba.updateAlliances())
        })

        socket.on("preloadMatch", (id: string) => {
            matchLogger.log("preloading", id)
            const match = matchmanager.setPreloadMatch(id)
            bucketmanager.setPatternAll(BucketPattern.ALLIANCE_STATION)
            io.to("dashboard").emit("preloadMatch", match.getData())
        })

        socket.on("loadMatch", (id: string) => {
            matchLogger.log("loading", id)
            const match = matchmanager.setLoadedMatch(id)
            hitmanager.reset()
            bucketmanager.setPatternAll(BucketPattern.ALLIANCE_STATION)
            Object.entries(hitmanager.getStates()).forEach(([station, state]) => { // TODO: make this a little nicer with a single event
                io.to("dashboard").emit("robotHitState", station as DriverStation, state)
            })
            probeEstops().then((didSucceed) => { if (!didSucceed) alert("Estop responses not received, check online") })
            io.to("dashboard").emit("loadMatch", match.getData())
        })

        socket.on("getHitStates", (cb) => {
            cb(hitmanager.getStates())
        })


        socket.on("partialMatch", async (data: PartialMatch) => {
            logger.debug("reciving match", data)
            if (!data.id) { logger.warn("recieved bad match data", data); return }
            const match = matchmanager.updateMatch(data)
            if (match != null) {
                io.to("dashboard").emit("match", match.getData())
            }
            if (data.red1 != null && data.red1 != 0) { io.to("dashboard").emit("team", await teammanager.getTeam(data.red1).getExtendedData()) }
            if (data.red2 != null && data.red2 != 0) { io.to("dashboard").emit("team", await teammanager.getTeam(data.red2).getExtendedData()) }
            if (data.red3 != null && data.red3 != 0) { io.to("dashboard").emit("team", await teammanager.getTeam(data.red3).getExtendedData()) }
            if (data.blue1 != null && data.blue1 != 0) { io.to("dashboard").emit("team", await teammanager.getTeam(data.blue1).getExtendedData()) }
            if (data.blue2 != null && data.blue2 != 0) { io.to("dashboard").emit("team", await teammanager.getTeam(data.blue2).getExtendedData()) }
            if (data.blue3 != null && data.blue3 != 0) { io.to("dashboard").emit("team", await teammanager.getTeam(data.blue3).getExtendedData()) }
        })

        socket.on("partialTeam", async (data: PartialTeam) => {
            logger.debug("receiving team", data)
            if (!data.id) { logger.warn("received bad team", data); return }
            const team = teammanager.updateTeam(data)
            if (team != null) {
                io.to("dashboard").emit("team", await team.getExtendedData())
            }
        })

        socket.on("deleteTeam", async (id: number) => {
            logger.log("deleting team", id)
            teammanager.deleteTeam(id)

            io.to("dashboard").emit("teams", teammanager.buildExtendedTeams())
        })

        socket.on("newTeam", async (data: TeamData) => {
            logger.debug("receiving full team", data)
            if (!data.id) { logger.warn("received bad team", data); return }
            if (data.displaynum == "") { delete data.displaynum }
            if (data.name == "") { delete data.name }
            const team = teammanager.newTeam({
                id: data.id,
                displaynum: data.displaynum ?? data.id.toString(),
                alliance: data.alliance ?? 0,
                alliancePosition: data.alliancePosition ?? 0,
                name: data.name ?? "Team " + data.displaynum ?? data.id.toString(),
                robotname: data.robotname,
                card: Card.NONE
            })
            if (team != null) {
                const extended = await team.getExtendedData()
                io.to("dashboard").emit("team", extended)
            }
        })

        socket.on("startMatch", async (id) => {
            const match = matchmanager.getCurrentMatch()
            if (id != match.id) { alert("Attempted to start a non-loaded match"); return; }
            match.startTime = Date.now();
            match.state = MatchState.IN_PROGRESS
            io.to("dashboard").emit("match", match.getData())
            })
        socket.on("abortMatch", (id) => {
            const match = matchmanager.getCurrentMatch()
            matchLogger.log("aborting", id)
            if (id != match.id) { alert("Aborted non-loaded match"); return; }
            match.startTime = 0;
            match.state = MatchState.PENDING
            bucketmanager.setPatternAll(BucketPattern.ALLIANCE_STATION)
            io.to("dashboard").emit("abortMatch", match.getData())
        })

        socket.on("commitMatch", (id) => {
            const match = matchmanager.getMatch(id)
            match.state = MatchState.POSTED

            const handleCard = async (card: Card, teamnum: number) => {
                if (card == Card.NONE) { return }
                const team = teammanager.getTeam(teamnum)
                if (team == null) { return }
                team.card = Card.YELLOW
                logger.log("Committing", card, "card for", teamnum)
                io.to("dashboard").emit("team", await team.getExtendedData())
            }
            handleCard(match.redCards[0], match.red1)
            handleCard(match.redCards[1], match.red2)
            handleCard(match.redCards[2], match.red3)
            handleCard(match.blueCards[0], match.blue1)
            handleCard(match.blueCards[1], match.blue2)
            handleCard(match.blueCards[2], match.blue3)
            logger.log("Committing", id)
            // TODO: Actually commit w/ TBA
            tba.updateMatches()

            io.to("dashboard").emit("match", match.getData())
        })

        socket.on("nextMatch", (type) => {
            const newmatch = matchmanager.advanceMatches(type as "elimination"|"qualification")
            if (newmatch != null) {
                io.to("dashboard").emit("match", newmatch.getData())
            }
        })

        socket.on("resetMatch", (id) => {
            const match = matchmanager.getMatch(id)
            logger.warn("Resetting match", id)
            match.state = MatchState.PENDING
            match.startTime = 0
            match.blueScoreBreakdown = getBlankScoreBreakdown()
            match.redScoreBreakdown = getBlankScoreBreakdown()
            io.to("dashboard").emit("match", match.getData())
        })

        socket.on("estop", (s) => handleEstop(s, true, socket.rooms.has("estop")))
        socket.on("unestop", (s) => handleEstop(s, false, socket.rooms.has("estop")))

        socket.on("partialEvent", async (data) => {
            console.log("recieved partial event", data)
            const settings = await DBSettings.getInstance()
            if (data.atLunch != null) { settings.atLunch = data.atLunch }
            if (data.lunchReturnTime != null) { settings.lunchReturnTime = data.lunchReturnTime }
            io.to("dashboard").emit("event", {
                atLunch: settings.atLunch,
                lunchReturnTime: settings.lunchReturnTime
            })
        })

        socket.on("disconnect", () => {
            logger.log("disconnected", socket.id, socket.handshake.auth.role)
            if (socket.handshake.auth.role == "estop") {
                probeEstops()
            }
        })

        socket.on("registerHit", (station) => {
            const success = hitmanager.registerHit(station)
            const match = matchmanager.getCurrentMatch()
          
                const stationnum = parseInt(station[1]) - 1
                if (station[0] == "B") {
                    match.redScoreBreakdown.targetHits[stationnum]++
                    match.redScoreBreakdown = match.redScoreBreakdown // Force DB save
                } else {
                    match.blueScoreBreakdown.targetHits[stationnum]++
                    match.blueScoreBreakdown = match.blueScoreBreakdown // Force DB save
                }
                io.to("dashboard").emit("match", match.getData())
        

        })

        socket.on("setBuckets", (stations:DriverStation[], pattern:BucketPattern) => {
            stations?.forEach((station) => {
                bucketmanager.setPattern(station, pattern)
            })
        })
        socket.on("undoHit", (station) => {
            hitmanager.undoHit(station)
            const match = matchmanager.getCurrentMatch()
            const stationnum = parseInt(station[1]) - 1
            if (station[0] == "B") {
                match.redScoreBreakdown.targetHits[stationnum]--
                if (match.redScoreBreakdown.targetHits[stationnum] < 0) {
                    match.redScoreBreakdown.targetHits[stationnum] = 0
                }
                match.redScoreBreakdown = match.redScoreBreakdown // Force DB save
            } else {
                match.blueScoreBreakdown.targetHits[stationnum]--
                if (match.blueScoreBreakdown.targetHits[stationnum] < 0) {
                    match.blueScoreBreakdown.targetHits[stationnum] = 0
                }
                match.blueScoreBreakdown = match.blueScoreBreakdown // Force DB save
            }
            io.to("dashboard").emit("match", match.getData())
        })

        function alert(...message: string[]) {
            matchLogger.warn("ALERT", ...message)
            socket.emit("alert", message.join(" "))
        }
    })


    async function pollEstopHosts(): Promise<void> {
        let complete: () => void
        io.to("estop").timeout(300).emit("queryEstop", (err, responses) => {
            if (responses == null || responses.length == 0) { logger.warn("No Estop Response"); return; }
            responses.forEach((data) => {
                if (data == null) { logger.warn("No Estop Response"); return; }
                if (data.B1 != null) { handleEstop("B1", data.B1, true) }
                if (data.B2 != null) { handleEstop("B2", data.B2, true) }
                if (data.B3 != null) { handleEstop("B3", data.B3, true) }
                if (data.R1 != null) { handleEstop("R1", data.R1, true) }
                if (data.R2 != null) { handleEstop("R2", data.R2, true) }
                if (data.R3 != null) { handleEstop("R3", data.R3, true) }
            })
            complete()

        })
        const success: Promise<void> = new Promise((resolve, reject) => {
            complete = resolve;
        })
        const timeout: Promise<void> = new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 300);
        });

        return Promise.race([success, timeout])


    }

    setInterval(() => {
        if (!matchmanager.isDBLoaded()) { return; }
        const match = matchmanager.getCurrentMatch()
        if (getMatchPeriod((Date.now() - match.startTime) / 1000) == MatchPeriod.POSTMATCH && match.state == MatchState.IN_PROGRESS) {
            match.state = MatchState.COMPLETE;
            probeEstops()
            matchLogger.log("Transitioning match", match.id, "to completed")
            io.to("dashboard").emit("match", match.getData())
        }
    }, 50)


    return {
        emitDsStatus(statuses: ExtendedDsStatuses) {
            io.to("dashboard").emit("dsStatus", statuses)
        },
        setLight(light: StackLightColor, state: StackLightState) {
            // console.log("Setting lights", light, on)
            io.to("light").emit("setLight", light, state)
        },
        pollEstopHosts,
        emitHitStatus(station: DriverStation, state: RobotHitState) {
            io.to("dashboard").emit("robotHitState", station, state)
        }
    }

}





