
// Put the following in /boot/config.txt
// gpio=7,20,19=op,dh
// gpio=1,21,13=ip,np

const { Gpio } = require("onoff");
const { io } = require("socket.io-client");
const consts = require("./consts.json")

const debounceDelay = 50



class Estop {
    pin
    station
    lastButtonState = 0
    currentButtonState = 0
    lastChangeTime = 0
    timeout = null

    constructor(pin, station) {
        this.pin = new Gpio(pin, "in", "both")
        this.station = station
        this.pin.watch((err, value) => this.handleButton(value))
        this.handleButton(this.pin.readSync())
    }

    handleButton(value) {
        if (value != this.lastButtonState) {this.lastChangeTime = Date.now()}
        if ((Date.now() - this.lastChangeTime) > debounceDelay) {
            if (value == this.currentButtonState) {return}
            if (value == 1) {
                handlePressed(this.station)
            } else {
                handleReleased(this.station)
            }
    
            this.currentButtonState = value
        } else {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => this.handleButton(value), debounceDelay+5)
        }
        this.lastButtonState = value;
    }
}

const estops = {}

consts.pins.forEach(([ds, pin]) => {
    estops[ds] = new Estop(pin, ds)
})

console.log(estops)


const handlePressed = (station) => {
    console.log(station, "pressed")
    socket.emit("estop", station)
    if (!socket.connected) {socket.connect()}
}

const handleReleased = (station) => {
    console.log(station, "released")
    socket.emit("unestop", station)
    if (!socket.connected) {socket.connect()}
}

const socket = io(consts.socket.host, {
    auth: {
        key: consts.socket.key,
        role: "estop"
    },
    autoConnect:false,
});
// socket.onAny((...data) => console.log(...data))
console.log("starting")
socket.on("connect", () => console.log("connected"))
socket.on("connect_error", (err) => console.log("connect failed", err.message))
socket.on("disconnect", (reason) => console.log("disconnect", reason))
socket.on("queryEstop", (cb) => {
    console.log("querying")
    const output = {B1:false, B2:false, B3:false}
    consts.pins.forEach(([ds, pin]) => {
        output[ds] = estops[ds].currentButtonState == 1
    })
    cb(output)
})
socket.connect()
