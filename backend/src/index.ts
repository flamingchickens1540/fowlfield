
import { DSStatuses, ExtendedDsStatus, ExtendedDsStatuses, StackLightColor, StackLightState } from '@fowltypes';
import * as http from 'http';
import rootLogger from 'logger';
import { DBSettings } from 'models/settings';
import * as statusmanager from "statusmanager";
import * as tba from "./tba/index";
import { IPCClient } from "./ipc/ipc";
import * as matchmanager from "./matchmanager";
import * as db from "./models/db";
import startSockets from "./sockets";
import * as teammanager from "./teammanager";
let driverStatuses:ExtendedDsStatuses

const server = http.createServer()

const ipc = new IPCClient({
    dsStatus: handleDSStatus,
})
let socketCallbacks:{
    emitDsStatus:(data:DSStatuses) => void,
    setLight:(color:StackLightColor, state:StackLightState) => void,
    pollEstopHosts:() => Promise<void>
};

let registerDSStatus: (data:DSStatuses) => ExtendedDsStatuses
async function configure() {
    await db.connect()
    await DBSettings.getInstance()
    await matchmanager.loadMatches()
    await teammanager.loadTeams()
    
    socketCallbacks = await startSockets(server, ipc)
    registerDSStatus = statusmanager.configure(socketCallbacks.setLight, ipc, socketCallbacks.pollEstopHosts).registerDSStatus
    ipc.load(matchmanager.getCurrentMatch().getData())
    await tba.reset("team")
    await tba.updateAlliances()
    await tba.updateMatches()
    await tba.updateRankings()

}

function isNewStatus(a:ExtendedDsStatus, b:ExtendedDsStatus) {
    const properties:(keyof ExtendedDsStatus)[] = ["bypassed", "dsConnected", "enabled", "isAuto", "isEstopped", "radioConnected", "robotConnected", "hardwareEstopOnline", "estopActive", "hardwareEstopPressed"]
    return !properties.every((property) => a[property] == b[property])
}

function areNewStatuses(data:ExtendedDsStatuses) {
    if (driverStatuses == null) {return true}
    return Object.keys(data).some((key) => isNewStatus(data[key], driverStatuses[key]))
}



let lastSentTime = Date.now()
function handleDSStatus(data:DSStatuses) {
    const extendedData = registerDSStatus(data)
    const currentTime = Date.now()
    if (areNewStatuses(extendedData) || currentTime-lastSentTime > 2_000) {
        lastSentTime = currentTime;
        socketCallbacks.emitDsStatus(extendedData)
    }
    driverStatuses = extendedData
    
}

export function getDsStatus() {
    return driverStatuses
}


configure()


rootLogger.log("starting node")

server.listen(3000)
