
import { AllianceStationStatus, DriverStation, IPCData, DSStatuses } from '@fowltypes';
import * as http from 'http';
import { IPCClient } from "./ipc/ipc";
import * as matchmanager from "./matchmanager";
import * as teammanager from "./teammanager";
import * as db from "./models/db";
import startSockets from "./sockets";
import { DBSettings } from 'models/settings';
import isEqual from "lodash.isequal"

let driverStatuses:{[key in DriverStation]:AllianceStationStatus};

const server = http.createServer()

const ipc = new IPCClient({
    dsStatus: handleDSStatus,
})
let sockets:{emitDsStatus:(data:DSStatuses) => void};
async function configure() {
    await db.connect()
    await DBSettings.getInstance()
    await matchmanager.loadMatches()
    await teammanager.loadTeams()
    sockets = await startSockets(server, ipc)

}

function canMatchStart() {
    let canStart = true;
    Object.values(driverStatuses).forEach((ds) => {
        if (!(ds.dsConnected && ds.robotConnected)) {
            canStart = false
        }
    })

    return canStart
}

function handleDSStatus(data:DSStatuses) {
    if (!isEqual(driverStatuses, data)) {
        console.log(data)
        sockets.emitDsStatus(data)
    }
    driverStatuses = data
    
}

export function getDsStatus() {
    return driverStatuses
}


configure()
// db.storeMatch({
//     redScore:20,
//     blueScore:3,
//     id: "abcde",
//     matchNumber: 1,
//     elimRound: -1,
//     elimGroup: -1, 
//     elimInstance: -1,
//     type: 'qualification',
//     red1: 1,
//     red2: 2,
//     red3: 3,
//     blue1: 4,
//     blue2: 5,
//     blue3: 6,
// })

// db.updateMatch({
//     redScore:15,
//     id: "abcde",
// })

// console.log(await db.getMatches())

console.log("starting node")

server.listen(3000)