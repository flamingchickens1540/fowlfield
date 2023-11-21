import { IPCClient } from "ipc/ipc";
import { DriverStation, RobotHitState } from "../../../common/types/types";
import rootLogger from "logger";
import { bucketmanager } from "managers";

const logger = rootLogger.getLogger("hitmanager")
let hitStates: { [key in DriverStation]: RobotHitState & { timeout: NodeJS.Timeout } } = {
    R1: {
        count: 0,
        lastDisable: 0,
        timeout: null
    },
    R2: {
        count: 0,
        lastDisable: 0,
        timeout: null
    },
    R3: {
        count: 0,
        lastDisable: 0,
        timeout: null
    },
    B1: {
        count: 0,
        lastDisable: 0,
        timeout: null
    },
    B2: {
        count: 0,
        lastDisable: 0,
        timeout: null
    },
    B3: {
        count: 0,
        lastDisable: 0,
        timeout: null
    }
}
let ipc: IPCClient
let hitChangeSubscriber: (station: DriverStation, state: RobotHitState) => void
export function configureHitManager(client: IPCClient, subscriber: (station: DriverStation, state: RobotHitState) => void) {
    ipc = client
    hitChangeSubscriber = subscriber
}

function notifySubscriber(station: DriverStation) {
    const state = hitStates[station]
    hitChangeSubscriber(station, {
        count:state.count as 0|1|2|3,
        lastDisable: state.lastDisable
    })
    bucketmanager.setPattern(station, state.count)
}

export function getStates(): { [key in DriverStation]: RobotHitState } {
    return hitStates
}
export function registerHit(station: DriverStation): boolean {
    const state = hitStates[station]
    if (state.count >= 3 || Date.now() - state.lastDisable < 6000) {
        return false
    }
    state.count++
    
    if (state.count >= 3) {
        logger.log("disabling", station)
        ipc.tempDisable(station)
        state.lastDisable = Date.now()
        if (state.timeout != null) {
            clearTimeout(state.timeout)
        }
        const t = setTimeout(() => {
            state.count = 0
            ipc.tempEnable(station)
            notifySubscriber(station)
        }, 5000)
        state.timeout = t
    }
    logger.log("registering hit for", station, state.count)
    notifySubscriber(station)
    return true
}

export function undoHit(station: DriverStation) {
    const state = hitStates[station]
    
    if (state.count >= 3) {
        if (state.timeout != null) {
            clearTimeout(state.timeout)
        }
        ipc.tempEnable(station)
        state.lastDisable = Date.now()-5000
    }
    state.count = Math.max(Math.min(2, state.count - 1), 0) as 0 | 1 | 2 | 3
    logger.log("Undoing hit", station, state.count)
    notifySubscriber(station)
}

export function reset() {
    hitStates = {
        R1: {
            count: 0,
            lastDisable: 0,
            timeout: null
        },
        R2: {
            count: 0,
            lastDisable: 0,
            timeout: null
        },
        R3: {
            count: 0,
            lastDisable: 0,
            timeout: null
        },
        B1: {
            count: 0,
            lastDisable: 0,
            timeout: null
        },
        B2: {
            count: 0,
            lastDisable: 0,
            timeout: null
        },
        B3: {
            count: 0,
            lastDisable: 0,
            timeout: null
        }
    }
}
