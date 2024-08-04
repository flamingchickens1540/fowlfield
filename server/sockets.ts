import {
    Card,
    type ClientToServerEvents,
    ExtendedTeam,
    type MatchData,
    MatchPeriod,
    MatchState,
    type PartialMatch,
    PartialTeam,
    type ServerToClientEvents,
    TeamData
} from '~common/types';
import * as http from "http";
import {Server, Socket} from "socket.io";
import config from "~common/config";
import * as matchmanager from "./managers/matchmanager";
import {getMatchPeriod} from '~common/utils/match_timer';
import * as teammanager from './managers/teammanager';
import {buildStats} from '~/models/teams';
import {createLogger} from "./logger"
import {instrument} from "@socket.io/admin-ui"
import {DBSettings} from '~/models/settings';

import * as tba from "./tba";
import {getBlankScoreBreakdown} from "~common/utils/blanks";
import {isProduction} from "~/index";
import jwt from "jsonwebtoken"

const logger = createLogger("socket")
let io: Server<ClientToServerEvents, ServerToClientEvents>

enum SocketAccess {
    VIEWER = "viewer",
    NORMAL = "normal",
}

export default function startServer(server: http.Server) {
    io = new Server(server, {
        path: "/ws",
        cors: {
            origin: "*"
        }
    })

    if (!isProduction) {
        logger.info("starting admin server")
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
        if (socket.handshake.auth?.token != null) {
            try {
                const decoded = jwt.verify(socket.handshake.auth.token, config.socket.signingKey);
                if (typeof decoded == "object" && "access" in decoded) {
                    socket.data.access = decoded.access;
                }
            } catch (e) {
                logger.warn("error decoding token", e)
            }
        }
        if (socket.data.access != null) {
            socket.emit("login", {success: true})
            setupSocket(socket)
        } else {
            socket.emit("login", {success: false})
        }
        socket.on("login", (password) => {
            let access:SocketAccess
            logger.info({password})
            if (password == config.socket.password) {
                access = SocketAccess.NORMAL
            } else if (password == config.socket.view_password) {
                access = SocketAccess.VIEWER
            }
            if (access != null) {
                socket.data.access = access;
                const token = jwt.sign({access}, config.socket.signingKey)
                socket.emit("login", {success:true, token})
                setupSocket(socket)
            } else {
                socket.emit("login", {success:false})
            }
        })
    })



    setInterval(() => {
        if (!matchmanager.isDBLoaded()) { return; }
        const match = matchmanager.getCurrentMatch()
        if (getMatchPeriod((Date.now() - match.startTime) / 1000) == MatchPeriod.POSTMATCH && match.state == MatchState.IN_PROGRESS) {
            match.state = MatchState.COMPLETE;
            logger.info("Transitioning match", match.id, "to completed")
            io.to("dashboard").emit("match", match.getData())
        }
    }, 50)


    return

}


function setupSocket(socket:Socket<ClientToServerEvents, ServerToClientEvents>) {

    logger.info("new connection from", socket.id, socket.handshake.address, socket.handshake.auth.role ?? "default")
    if ((socket.handshake.auth.role ?? "") == "estop") {
        socket.join("estop")
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
        logger.info("preloading", id)
        const match = matchmanager.setPreloadMatch(id)
        io.to("dashboard").emit("preloadMatch", match.getData())
    })

    socket.on("loadMatch", (id: string) => {
        logger.info("loading", id)
        const match = matchmanager.setLoadedMatch(id)
        io.to("dashboard").emit("loadMatch", match.getData())
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
        logger.info("deleting team", id)
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
        logger.info("aborting", id)
        if (id != match.id) { alert("Aborted non-loaded match"); return; }
        match.startTime = 0;
        match.state = MatchState.PENDING
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
            logger.info("Committing", card, "card for", teamnum)
            io.to("dashboard").emit("team", await team.getExtendedData())
        }
        handleCard(match.redCards[0], match.red1)
        handleCard(match.redCards[1], match.red2)
        handleCard(match.redCards[2], match.red3)
        handleCard(match.blueCards[0], match.blue1)
        handleCard(match.blueCards[1], match.blue2)
        handleCard(match.blueCards[2], match.blue3)
        logger.info("Committing", id)
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


    socket.on("partialEvent", async (data) => {
        console.info("recieved partial event", data)
        const settings = await DBSettings.getInstance()
        if (data.atLunch != null) { settings.atLunch = data.atLunch }
        if (data.lunchReturnTime != null) { settings.lunchReturnTime = data.lunchReturnTime }
        io.to("dashboard").emit("event", {
            atLunch: settings.atLunch,
            lunchReturnTime: settings.lunchReturnTime
        })
    })

    socket.on("disconnect", () => {
        logger.info("disconnected", socket.id, socket.handshake.auth.role)
    })

    function alert(...message: string[]) {
        logger.warn("ALERT", ...message)
        socket.emit("alert", message.join(" "))
    }
}





