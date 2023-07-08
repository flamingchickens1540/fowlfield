
// Put the following in /boot/config.txt
// gpio=20,19=op,dh
// gpio=21,13=ip,np

const { Gpio } = require("onoff");
const { io } = require("socket.io-client");
const consts = require("./consts.json")
const {StackLightState} = require("../../common/types/stack_light_types.ts")

class Bulb {
    pin
    interval = null

    constructor(pin) {
        this.pin = new Gpio(pin, "out")
    }

    setSolid(on) {
        clearInterval(this.interval)
        this.pin.writeSync(on)
    }

    setBlink(interval) {
        clearInterval(this.interval)
        this.interval = setInterval(() => {this.pin.writeSync(this.pin.readSync() ^ 1)}, interval)
    }


}

const lights = {}

consts.pins.forEach(([color, pin]) => {
    lights[color] = new Bulb(pin)
    lights[color].setSolid(1)
})


const socket = io(consts.socket.host, {
    auth: {
        key: consts.socket.key,
        role: "light"
    },
    autoConnect:false,
});
// socket.onAny((...data) => console.log(...data))
console.log("starting")
socket.on("connect", () => {
    console.log("connected")
    consts.pins.forEach(([color, pin]) => {
        lights[color].setSolid(0)
    })
})
socket.on("connect_error", (err) => console.log("connect failed", err.message))
socket.on("disconnect", (reason) => console.log("disconnect", reason))
socket.on("setLight", (color, state) => {
    const light = lights[color]
    switch (state) {
        case StackLightState.SOLID: light.setSolid(1);break;
        case StackLightState.OFF: light.setSolid(0);break;
        case StackLightState.FLASH: light.setBlink(300);break;
    }
})
socket.connect()
