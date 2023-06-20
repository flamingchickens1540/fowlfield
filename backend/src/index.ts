
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
    red1: 1,
    red2: 2,
    red3: 3,
    blue1: 4,
    blue2: 5,
    blue3: 6,
})

console.log("starting")