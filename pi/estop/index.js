
// Put the following in /boot/config.txt
// gpio=20,19=op,dh
// gpio=21,13=ip,np

const { Gpio } = require("onoff");
const { io } = require("socket.io-client");


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

const estops = {
    "R1": new Estop(21, "R1"),
    "R2": new Estop(13, "R2"),
    // "R3": new Estop(0, "R3")
}


const handlePressed = (station) => {
    console.log(station, "pressed")
    socket.emit("estop", station)
}

const handleReleased = (station) => {
    console.log(station, "released")
}

const socket = io("http://192.168.86.69:3000", {
    auth: {
        key: "fowlfield",
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
    cb({
        "R1":estops["R1"].currentButtonState,
        "R2": estops["R2"].currentButtonState,
        "R3": false,
        "B1": false,
        "B2": false,
        "B3": false,

        // "R2":estops["R2"].currentButtonState,
        // "R3":estops["R3"].currentButtonState
    })
})
socket.connect()
