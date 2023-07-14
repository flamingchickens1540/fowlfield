// Add to /boot/config.txt
// gpio=2,3,4,14=op,dh


const { Gpio } = require("onoff");
const { io } = require("socket.io-client")
const consts = require("./consts.json")


class Bulb {
    pin
    currentStateData
    currentStateSolid

    constructor(pin) {
        this.pin = new Gpio(pin, "out")
    }

    checkAndUpdateState(solid, data) {
        const isNew = this.currentStateData != data|| this.currentStateSolid!=solid
        this.currentStateData = data;
        this.currentStateSolid = solid
        return isNew
    }

    setSolid(on) {
        if (!this.checkAndUpdateState(true, on)) {return false}
        this.pin.writeSync(on)
        return true
    }

    setBlink() {
        if (!this.checkAndUpdateState(false, null)) {return false}
        this.blink()
        return true
    }
    blink() {
        this.pin.writeSync(this.pin.readSync() ^ 1)
    }


}

const lights = {}



consts.pins.forEach(([color, pin]) => {
    lights[color] = new Bulb(pin)
    lights[color].setSolid(1)
})

const lightList = Object.values(lights);
let blinkState = false
const timer = setInterval(() => {
    lightList.forEach((light) => {
        if (!light.currentStateSolid) {
            light.pin.writeSync(blinkState ? 1 :0)
        }
        
    })
    blinkState = !blinkState
},500)


let disconnectedBlinkIndex = 0
let disconnectedBlinkDown = true
let disconnectedBlinker;
function launchDisconnectedBlinker() {
    clearInterval(disconnectedBlinker)
    disconnectedBlinker =setInterval(() => {
        lightList.forEach((light, index) => {
            light.setSolid(index == disconnectedBlinkIndex ? 1 : 0)
        })
        if (disconnectedBlinkIndex == lightList.length-1) {
            disconnectedBlinkDown = false
        } else if (disconnectedBlinkIndex == 0) {
            disconnectedBlinkDown = true
        }
        if (disconnectedBlinkDown) {
            disconnectedBlinkIndex++
        } else {
            disconnectedBlinkIndex--
        }
    },200)
}



const socket = io(consts.socket.host, {
    auth: {
        key: consts.socket.key,
        role: "light"
    },
    autoConnect:false,
});
// socket.onAny((...data) => console.log(...data))
console.log("starting")
launchDisconnectedBlinker()

socket.on("connect", () => {
    console.log("connected")
    clearInterval(disconnectedBlinker)
    consts.pins.forEach(([color, pin]) => {
        lights[color].setSolid(0)
    })

})
socket.on("connect_error", (err) => console.log("connect failed", err.message))
socket.on("disconnect", (reason) => {launchDisconnectedBlinker(); console.log("disconnect", reason)})
socket.on("setLight", (color, state) => {
    clearInterval(disconnectedBlinker)
    const light = lights[color]
    let result
    switch (state) {
        case "solid": result=light.setSolid(1);break;
        case "off": result=light.setSolid(0);break;
        case "flash": result=light.setBlink();break;
    }

    if (result) {console.log("set", color, state)}
})
socket.connect()
