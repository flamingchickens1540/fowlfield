import { ClientToServerEvents, DSStatuses, DriverStation, MatchState, ServerToClientEvents, StackLightColor, StackLightState } from "@fowltypes";
import { IPCClient } from "ipc/ipc";
import { Server } from "socket.io";
import { getCurrentMatch } from './matchmanager';
import rootLogger from "logger";
let lightSetter:(light:StackLightColor, state:StackLightState)=>void
let estopProber: () => Promise<void>;
let ipcClient:IPCClient

const logger = rootLogger.getLogger("status")

export function configure(setLight: (light: StackLightColor, state: StackLightState) => void, ipc:IPCClient, probeEstops:() => Promise<void>) {
    lightSetter = setLight
    estopProber = probeEstops
    ipcClient = ipc
    return {registerDSStatus}
}

const hardwareEstops:{[key in DriverStation]:{online:boolean, pressed:boolean}} = {
    R1: {
        online: false,
        pressed: false
    },
    R2: {
        online: false,
        pressed: false
    },
    R3: {
        online: false,
        pressed: false
    },
    B1: {
        online: false,
        pressed: false
    },
    B2: {
        online: false,
        pressed: false
    },
    B3: {
        online: false,
        pressed: false
    }
}
const DSKeys = Object.keys(hardwareEstops) as DriverStation[]

const states = {
    redConnected:false,
    blueConnected:false,
    redEnabled:false,
    blueEnabled:false,
    estopPressed:false,
    estopOnline:false,
}

export function isMatchReady() {
    return states.redConnected && states.blueConnected && !states.estopPressed && states.estopOnline
}


function updateLights() {
    const matchActive = getCurrentMatch().state == MatchState.IN_PROGRESS
    const matchDone = getCurrentMatch().state == MatchState.COMPLETE || getCurrentMatch().state == MatchState.POSTED
    lightSetter(StackLightColor.RED, matchDone ? StackLightState.OFF: states.redConnected ? (states.redEnabled ? StackLightState.SOLID : StackLightState.OFF) : StackLightState.FLASH)
    lightSetter(StackLightColor.BLUE, matchDone ? StackLightState.OFF:  states.blueConnected ? (states.blueEnabled ? StackLightState.SOLID : StackLightState.OFF) : StackLightState.FLASH)
    lightSetter(StackLightColor.ORANGE, !states.estopOnline ? StackLightState.FLASH : (states.estopPressed ? StackLightState.SOLID : StackLightState.OFF))
    lightSetter(StackLightColor.GREEN, matchActive ? StackLightState.SOLID : isMatchReady() ? StackLightState.FLASH : StackLightState.OFF)
}

function registerDSStatus(statuses:DSStatuses) {
    const redStatuses = [statuses["R1"], statuses["R2"], statuses["R3"]]
    const blueStatuses = [statuses["B1"], statuses["B2"], statuses["B3"]]
    states.redConnected = redStatuses.every((status) => status.bypassed || status.robotConnected)
    states.redEnabled   = redStatuses.some((status) => status.enabled)
    states.blueConnected = blueStatuses.every((status) => status.bypassed || status.robotConnected)
    states.blueEnabled   = blueStatuses.some((status) => status.enabled)
    updateLights()
}

export async function probeEstops():Promise<boolean> {
    DSKeys.forEach((key) => hardwareEstops[key].online = false)
    await estopProber()
    states.estopOnline = DSKeys.every((key) => hardwareEstops[key].online)
    updateLights()
    return states.estopOnline
}

export function handleEstop(station:DriverStation, state:boolean, isHardware:boolean) {
    hardwareEstops[station].pressed = state;
    if (isHardware) {hardwareEstops[station].online = true}
    
    states.estopPressed = Object.values(hardwareEstops).some((estop) => estop.pressed)
    
    if (state) {
        ipcClient.estop(station)
        logger.log("estopping", station)
    } else {
        if (getCurrentMatch().state != MatchState.IN_PROGRESS) {
            ipcClient.unestop(station)
            logger.log("lifting estop", station)
        } else {
            logger.log('not lifting estop', station)
        }
    }
    updateLights()
}