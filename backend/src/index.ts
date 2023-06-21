
import * as db from "./models/db"
import { IPCClient } from "./ipc/ipc"
import { IPCData, AllianceStationStatus } from './ipc/ipctypes';
import {DBMatch, configureBracket} from "./models/matches"
import { DriverStation } from './types';


let driverStatuses:{[key in DriverStation]:AllianceStationStatus};
let matches:{[key:string]:DBMatch}
const ipc = new IPCClient({
    dsStatus: handleDSStatus,
})
async function configure() {
    await configureBracket()
    await db.connect()
    matches = await db.getMatches()
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

function handleDSStatus(data:IPCData["ds_status"]) {
    driverStatuses = data!
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
