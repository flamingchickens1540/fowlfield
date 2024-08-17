import { io, type Socket } from 'socket.io-client'
import { setCookie } from 'typescript-cookie'

import { updateLoadedMatch, updateMatchList, updateStoredEventinfo, updateStoredMatch, updateStoredTeam, updateTeamList, updateTimeOffset } from '~/lib/store'
import type { ClientToServerEvents, ServerToClientEvents } from '~common/types'

const disconnectedBackgroundColor = '#463500'
let isConnected = true

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(window.location.protocol + '//' + window.location.hostname + ':3000', {
    auth: {
        token: localStorage.getItem('auth')
    },
    path: '/ws',
    autoConnect: false
})

socket.on('login', ({ success, token }) => {
    console.info('Logged in', success, token)
    if (token) {
        localStorage.setItem('auth', token)
    }
    if (!success) {
        socket.emit('login', prompt('Enter FowlField password')!)
    }
})

socket.onAny((event, ...args) => {
    if (!isConnected) {
        isConnected = true
        document.body.style.backgroundColor = ''
    }
    console.debug('received', event, ...args)
})

socket.on('match', updateStoredMatch)
socket.on('matches', (v) => {
    updateMatchList(v)
    setLoaded('matches')
})
socket.on('team', updateStoredTeam)
socket.on('teams', (v) => {
    updateTeamList(v)
    setLoaded('teams')
})
socket.on('preloadMatch', (match) => {
    updateLoadedMatch('preload', match)
})
socket.on('loadMatch', (match) => {
    updateLoadedMatch('load', match)
})

socket.on('event', updateStoredEventinfo)

socket.on('connect_error', (err) => {
    if (isConnected) {
        isConnected = false
        document.body.style.backgroundColor = disconnectedBackgroundColor
    }
})
socket.on('disconnect', (reason) => {
    console.warn("Disconnected from socket server. Reason: '" + reason + "'")
    if (isConnected) {
        isConnected = false
        document.body.style.backgroundColor = disconnectedBackgroundColor
    }
})

socket.on('alert', (msg) => {
    console.warn(msg)
    window.alert(msg)
})

socket.connect()

function setTimeOffset() {
    let start = Date.now()
    socket.emit('ping', (time) => {
        let delta = (Date.now() - start) / 2
        updateTimeOffset(time + delta)
    })
}

const hasLoaded = { teams: false, matches: false }
const isLoaded = () => Object.values(hasLoaded).every((v) => v)
let loadCBs: (() => void)[] | null = []
function setLoaded(field: keyof typeof hasLoaded) {
    hasLoaded[field] = true
    console.error(hasLoaded)
    if (isLoaded() && loadCBs) {
        loadCBs.forEach((cb) => cb())
        loadCBs = null
    }
}

export function onLoaded(cb: () => void) {
    if (isLoaded()) {
        cb()
    } else {
        console.error(hasLoaded)
        loadCBs?.push(cb)
    }
}

setTimeOffset()
export default socket
