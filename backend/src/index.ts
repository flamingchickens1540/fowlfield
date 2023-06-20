
import createIPC from "./ipc"

const ipc = createIPC({
    dsStatus(data) {
        console.log(data)
    },
})
ipc.load({
    id: "Abc",
    matchNumber: 1,
    elimRound: -1,
    elimGroup: -1, 
    elimInstance: -1,
    type: 'qualification',
    red1: 0,
    red2: 0,
    red3: 0,
    blue1: 0,
    blue2: 0,
    blue3: 0,
})

console.log("starting")