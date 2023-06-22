import type { ClientToServerEvents, PartialMatch, ServerToClientEvents } from '@fowltypes';
import * as http from "http";
import { Server } from "socket.io";
import consts from "../secrets.json";
import matchmanager from "./matchmanager";


let io:Server<ClientToServerEvents,ServerToClientEvents> 

export default function startServer(server:http.Server) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket) => {
        if (socket.handshake.auth.key !== consts.socket.key) {
            socket.disconnect(true)
        }
        socket.emit("setMatch", matchmanager.getCurrentMatch().getData())
        socket.emit("syncTime", Date.now()) // Account for time zone differences
        socket.on("partialMatch", (data:PartialMatch) => {
            console.log("recived", data)
            if (!data.id) {console.warn("recieved bad match data", data);return}
            let match = matchmanager.updateMatch(data)
            io.emit("match", match.getData())
        })

    })
    
}



