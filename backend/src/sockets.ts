import {Server} from "socket.io"
import consts from "../secrets.json"
import { PartialMatch } from "../../types/types";
import matchmanager from "./matchmanager";
import type { ThisServer } from '../../types/ws_types';
import * as http from "http"



let io:ThisServer 

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
        socket.on("partialMatch", (data:PartialMatch) => {
            console.log("recived", data)
            if (!data.id) {console.warn("recieved bad match data", data);return}
            let match = matchmanager.updateMatch(data)
            io.emit("match", match.getData())
        })

    })
    
}



