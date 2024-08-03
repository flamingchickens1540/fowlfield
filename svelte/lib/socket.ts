import {io, type Socket} from "socket.io-client";
import {getCookie, setCookie} from 'typescript-cookie';

import {
    updateDSStatuses,
    updateEventInfo,
    updateLoadedMatch,
    updateMatchList,
    updateMatchStores,
    updateTeamList,
    updateTeamStores,
    updateTimeOffset
} from '~/lib/store';
import type {ClientToServerEvents, ServerToClientEvents} from '~common/types';


const socket:Socket<ServerToClientEvents, ClientToServerEvents> = io(null || window.location.origin, {
    auth: {
        key: getCookie("auth")
    },
    autoConnect:false
})

socket.on("match", updateMatchStores)
socket.on("matches", updateMatchList)
socket.on("team", updateTeamStores)
socket.on("teams", updateTeamList)
socket.on("abortMatch", updateMatchStores)
socket.on("preloadMatch", (match) => updateLoadedMatch(true, match))
socket.on("loadMatch", (match) => updateLoadedMatch(false, match))
socket.on("syncTime", updateTimeOffset)
socket.on("dsStatus", updateDSStatuses)
socket.on("event", updateEventInfo)
// socket.on("matchData", (data) => {
//     updateMatchData(data)
// })

// socket.on("matchStart", (data) => {
//     timer.startWithTime(data.matchStartTime)
// })
// socket.on("matchEnd", updateMatchData)

socket.on("connect_error", (err) => alert("Could not connect to socket server. "+err))
socket.on("disconnect", (reason) => {
    if (reason == "io server disconnect") {
        setCookie("auth", prompt("Input your key"), {
            expires:365
        })
        window.location.reload()
    } else {
        alert("Disconnected from socket server")
    }
})

socket.on("alert", (msg) => {
    window.alert(msg)
})


socket.connect()

export default socket