import { DSStatuses, DriverStation, ExtendedDsStatuses, MatchState, StackLightColor, StackLightState } from '~common/types';
import rootLogger from "~/logger";
import { getCurrentMatch } from './matchmanager';
let lightSetter: (light: StackLightColor, state: StackLightState) => void
let estopProber: () => Promise<void>;


const logger = rootLogger.getLogger("status")

export function configure(setLight: (light: StackLightColor, state: StackLightState) => void, probeEstops: () => Promise<void>) {
    lightSetter = setLight
    estopProber = probeEstops
    return { registerDSStatus }
}

const hardwareEstops: { [key in DriverStation]: { online: boolean, active: boolean, pressed:boolean } } = {
    R1: {
        online: false,
        active: false,
        pressed: false
    },
    R2: {
        online: false,
        active: false,
        pressed: false
    },
    R3: {
        online: false,
        active: false,
        pressed: false
    },
    B1: {
        online: false,
        active: false,
        pressed: false
    },
    B2: {
        online: false,
        active: false,
        pressed: false
    },
    B3: {
        online: false,
        active: false,
        pressed: false
    }
}
const DSKeys = Object.keys(hardwareEstops) as DriverStation[]

const states = {
    redConnected: false,
    blueConnected: false,
    redEnabled: false,
    blueEnabled: false,
    estopPressed: false,
    estopOnline: false,
}

export function isMatchReady() {
    return states.redConnected && states.blueConnected && !states.estopPressed && states.estopOnline
}


function updateLights() {
    const matchActive = getCurrentMatch().state == MatchState.IN_PROGRESS
    lightSetter(StackLightColor.RED, states.redConnected ? (states.redEnabled ? StackLightState.SOLID : StackLightState.OFF) : StackLightState.FLASH)
    lightSetter(StackLightColor.BLUE, states.blueConnected ? (states.blueEnabled ? StackLightState.SOLID : StackLightState.OFF) : StackLightState.FLASH)
    lightSetter(StackLightColor.ORANGE, !states.estopOnline ? StackLightState.FLASH : (states.estopPressed ? StackLightState.SOLID : StackLightState.OFF))
    lightSetter(StackLightColor.GREEN, matchActive ? StackLightState.SOLID : isMatchReady() ? StackLightState.FLASH : StackLightState.OFF)
}

function registerDSStatus(statuses: DSStatuses):ExtendedDsStatuses {
    const redStatuses = [statuses["R1"], statuses["R2"], statuses["R3"]]
    const blueStatuses = [statuses["B1"], statuses["B2"], statuses["B3"]]
    states.redConnected = redStatuses.every((status) => status.bypassed || status.robotConnected)
    states.redEnabled = redStatuses.some((status) => status.enabled)
    states.blueConnected = blueStatuses.every((status) => status.bypassed || status.robotConnected)
    states.blueEnabled = blueStatuses.some((status) => status.enabled)
    states.estopPressed = Object.entries(hardwareEstops).some(([key, estop]) => estop.pressed || statuses[key].estopActive)
    updateLights()

    return {
        R1:{hardwareEstopOnline:hardwareEstops.R1.online,hardwareEstopPressed:hardwareEstops.R1.pressed, ...statuses.R1},
        R2:{hardwareEstopOnline:hardwareEstops.R2.online,hardwareEstopPressed:hardwareEstops.R2.pressed, ...statuses.R2},
        R3:{hardwareEstopOnline:hardwareEstops.R3.online,hardwareEstopPressed:hardwareEstops.R3.pressed, ...statuses.R3},
        B1:{hardwareEstopOnline:hardwareEstops.B1.online,hardwareEstopPressed:hardwareEstops.B1.pressed, ...statuses.B1},
        B2:{hardwareEstopOnline:hardwareEstops.B2.online,hardwareEstopPressed:hardwareEstops.B2.pressed, ...statuses.B2},
        B3:{hardwareEstopOnline:hardwareEstops.B3.online,hardwareEstopPressed:hardwareEstops.B3.pressed, ...statuses.B3},
    }
}

export async function probeEstops(): Promise<boolean> {
    DSKeys.forEach((key) => hardwareEstops[key].online = false)
    await estopProber()
    states.estopOnline = DSKeys.every((key) => hardwareEstops[key].online)
    updateLights()
    logger.log("probed estops")
    return states.estopOnline
}

export function handleEstop(station: DriverStation, state: boolean, isHardware: boolean) {
    
}


