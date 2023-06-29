
import { AllianceStationStatus, DriverStation, IPCData, DSStatuses } from '@fowltypes';
import * as http from 'http';
import { IPCClient } from "./ipc/ipc";
import * as matchmanager from "./matchmanager";
import * as teammanager from "./teammanager";
import * as db from "./models/db";
import startSockets from "./sockets";
import { DBSettings } from 'models/settings';
import isEqual from "lodash.isequal"
import rootLogger from 'logger';

let driverStatuses:DSStatuses

const server = http.createServer()

const ipc = new IPCClient({
    dsStatus: handleDSStatus,
})
let socketCallbacks:{emitDsStatus:(data:DSStatuses) => void};
async function configure() {
    await db.connect()
    await DBSettings.getInstance()
    await matchmanager.loadMatches()
    await teammanager.loadTeams()
    socketCallbacks = await startSockets(server, ipc)

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