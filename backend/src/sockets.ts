import {Server} from "socket.io"
import consts from "../secrets.json"

const io = new Server()


io.use((socket, next) => {
    
    return next(new Error('authentication error'));
  });

io.on("connection", (socket) => {
    if (socket.handshake.auth.key === consts.socket.key) {
        socket.disconnect(true)
    }
})