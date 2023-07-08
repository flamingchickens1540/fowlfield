
import { AllianceStationStatus, DriverStation, IPCData, DSStatuses, StackLightState, StackLightColor, MatchState } from '@fowltypes';
import * as http from 'http';
import { IPCClient } from "./ipc/ipc";
import * as matchmanager from "./matchmanager";
import * as teammanager from "./teammanager";
import * as db from "./models/db";
import startSockets from "./sockets";
import { DBSettings } from 'models/settings';
import isEqual from "lodash.isequal"
import rootLogger from 'logger';
import * as tba from "tba"
let driverStatuses:DSStatuses

const server = http.createServer()

const ipc = new IPCClient({
    dsStatus: handleDSStatus,
})
let socketCallbacks:{
    emitDsStatus:(data:DSStatuses) => void,
    setLight:(color:StackLightColor, state:StackLightState) => void
};
async function configure() {
    await db.connect()
    await DBSettings.getInstance()
    await matchmanager.loadMatches()
    await teammanager.loadTeams()
    socketCallbacks = await startSockets(server, ipc)
    ipc.load(matchmanager.getCurrentMatch().getData())
    await tba.reset("team")
    await tba.updateAlliances()
    await tba.updateMatches()
    await tba.updateRankings()

}

function isNewStatus(a:AllianceStationStatus, b:AllianceStationStatus) {
    const properties:(keyof AllianceStationStatus)[] = ["bypassed", "dsConnected", "enabled", "isAuto", "isEstopped", "radioConnected", "robotConnected"]
    return !properties.every((property) => a[property] == b[property])
}

function areNewStatuses(data:DSStatuses) {
    if (driverStatuses == null) {return true}
    return Object.keys(data).some((key) => isNewStatus(data[key], driverStatuses[key]))
}
let lastSentTime = Date.now()
function handleDSStatus(data:DSStatuses) {
    let redReady = true;
    let blueReady = true;
    let redEnabled = false;
    let blueEnabled = false
    let estopsGood = true;
    Object.entries(data).forEach(([station, state]) => {
        const isRed = station == "R1" || station == "R2" || station == "R3"
        if (!state.robotConnected && !state.bypassed) {
            if (isRed) {
                redReady = false
            } else {
                blueReady = false
            }
        }
        if (state.enabled) {
            if (isRed) {
                redEnabled = true
            } else {
                blueEnabled = true
            }
        }
        if (state.isEstopped) {estopsGood = false}
    })
    // console.log('status', redGood, blueGood)
    socketCallbacks.setLight(StackLightColor.RED, redReady ? (redEnabled ? StackLightState.SOLID : StackLightState.OFF) : StackLightState.FLASH)
    socketCallbacks.setLight(StackLightColor.BLUE, blueReady ? (blueEnabled ? StackLightState.SOLID : StackLightState.OFF) : StackLightState.FLASH)
    socketCallbacks.setLight(StackLightColor.ORANGE, estopsGood ? StackLightState.OFF : matchmanager.getCurrentMatch().state == MatchState.PENDING ? StackLightState.FLASH : StackLightState.SOLID)
    // console.log("lights", !redGood, !blueGood, !estopsGood)
    const currentTime = Date.now()
    if (areNewStatuses(data) || currentTime-lastSentTime > 2_000) {
        lastSentTime = currentTime;
        socketCallbacks.emitDsStatus(data)
    }
    driverStatuses = data
    
}

export function getDsStatus() {
    return driverStatuses
}


configure()


rootLogger.log("starting node")

server.listen(3000)
