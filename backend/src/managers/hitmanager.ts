import { IPCClient } from "ipc/ipc";
import { DriverStation, RobotHitState } from "../../../common/types/types";
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
export function registerHit(station: DriverStation): boolean {
    console.log("registering hit")
    const state = hitStates[station]
    if (state.count >= 3 || Date.now() - state.lastDisable < 6000) {
        return false
    }
    state.count++
    if (state.count >= 3) {
        console.log("disabling")
        ipc.tempDisable(station)
        console.log("disabled")
        state.lastDisable = Date.now()
        console.log("hitA")
        if (state.timeout != null) {
            clearTimeout(state.timeout)
        }
        console.log("hitB")
        const t = setTimeout(() => {
            state.count = 0
            ipc.tempEnable(station)
        }, 5000)
        console.log("hitC")
        state.timeout = t
        console.log("hitD")
    }
    hitChangeSubscriber(station, {
        count:state.count as 0|1|2|3,
        lastDisable: state.lastDisable
    })
    return true
}

export function undoHit(station: DriverStation) {
    const state = hitStates[station]
    if (state.count >= 3) {
        if (state.timeout != null) {
            clearTimeout(state.timeout)
        }
        ipc.tempEnable(station)
    }
    state.count = Math.max(Math.min(2, state.count - 1), 0) as 0 | 1 | 2 | 3
    hitChangeSubscriber(station, state)
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
