import {
    type ClientToServerEvents,
    MatchPeriod,
    type PartialMatch,
    PartialTeam,
    type ServerToClientEvents
} from '~common/types'
import * as http from 'http'
import { Server, Socket } from 'socket.io'
import config from '~common/config'
import * as matchmanager from './managers/matchmanager'
import { getMatches } from './managers/matchmanager'
import { getMatchPeriod } from '~common/utils/match_timer'
import * as teammanager from './managers/teammanager'
import { getTeams } from './managers/teammanager'
import { createLogger } from './logger'
import { instrument } from '@socket.io/admin-ui'

import * as tba from './tba'
import { getBlankScoreBreakdown } from '~common/utils/blanks'
import { isProduction } from '~/index'
import jwt from 'jsonwebtoken'
import prisma from '~/managers/db'
import { eventState } from '~/managers/settings'
import { getAlliances } from '~common/utils/scores'

const logger = createLogger('socket')
export let io: Server<ClientToServerEvents, ServerToClientEvents>

enum SocketAccess {
    VIEWER = 'viewer',
    NORMAL = 'normal'
}

const handleMatchEnd = async () => {
    const match = await matchmanager.getLoadedMatch()
    if (
        getMatchPeriod((Date.now() - match.startTime) / 1000) ==
            MatchPeriod.POSTMATCH &&
        match.state == 'in_progress'
    ) {
        match.state = 'ended'
        logger.info('Transitioning match', match.id, 'to completed')
        io.emit('match', match)
    }
}

export default function startServer(server: http.Server) {
    io = new Server(server, {
        path: '/ws',
        cors: {
            origin: '*'
        }
    })

    if (!isProduction) {
        logger.info('starting admin server')
        instrument(io, {
            auth: {
                type: 'basic',
                username: 'admin',
                password:
                    '$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS' // "changeit" encrypted with bcrypt
            },
            mode: 'development'
        })
    }

    io.on('connection', (socket) => {
        if (socket.handshake.auth?.token != null) {
            try {
                const decoded = jwt.verify(
                    socket.handshake.auth.token,
                    config.socket.signingKey
                )
                if (typeof decoded == 'object' && 'access' in decoded) {
                    socket.data.access = decoded.access
                }
            } catch (e) {
                logger.warn('error decoding token', e)
            }
        }
        if (socket.data.access != null) {
            socket.emit('login', { success: true })
            setupSocket(socket)
        } else {
            socket.emit('login', { success: false })
        }
        socket.on('login', (password) => {
            let access: SocketAccess
            if (password == config.socket.password) {
                access = SocketAccess.NORMAL
            } else if (password == config.socket.view_password) {
                access = SocketAccess.VIEWER
            }
            if (access != null) {
                socket.data.access = access
                const token = jwt.sign({ access }, config.socket.signingKey)
                socket.emit('login', { success: true, token })
                setupSocket(socket)
            } else {
                socket.emit('login', { success: false })
            }
        })
    })

    setInterval(handleMatchEnd, 5000) // just in case

    return
}

async function setupSocket(
    socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
    logger.info(
        'new connection from',
        socket.id,
        socket.handshake.address,
        socket.handshake.auth.role ?? 'default'
    )

    // Send initial data
    socket.emit('loadMatch', await matchmanager.getLoadedMatch())
    socket.emit('preloadMatch', await matchmanager.getPreloadedMatch())
    socket.emit('matches', await getMatches())
    socket.emit('teams', await getTeams())
    socket.emit('event', {
        atLunch: eventState.atLunch,
        lunchReturnTime: eventState.lunchReturnTime
    })

    socket.on('ping', (cb) => {
        cb(Date.now())
    })

    socket.on('commitAlliances', async (cb) => {
        cb(await tba.updateAlliances())
    })

    socket.on('preloadMatch', (id: string) => {
        logger.info('preloading', id)
        matchmanager.updatePreloadedMatch(id)
    })

    socket.on('loadMatch', (id: string) => {
        logger.info('loading', id)
        matchmanager.updateLoadedMatch(id)
    })

    socket.on('partialMatch', async (data: PartialMatch) => {
        logger.debug('receiving match', data)
        if (!data.id) {
            logger.warn('received bad match data', data)
            return
        }
        const match = await matchmanager.updateMatch(data)
        io.emit('match', match)
    })

    socket.on('partialTeam', async (data: PartialTeam) => {
        logger.debug('receiving team', data)
        if (!data.id) {
            logger.warn('received bad team', data)
            return
        }
        const team = await teammanager.updateTeam(data)
        io.emit('team', team)
    })

    socket.on('deleteTeam', async (id: number) => {
        logger.info('deleting team', id)
        await teammanager.deleteTeam(id)

        io.emit('teams', await getTeams())
    })

    socket.on('newTeam', async (data: PartialTeam) => {
        logger.debug('receiving full team', data)
        if (!data.id) {
            logger.warn('received bad team', data)
            return
        }
        const display_number = data.display_number || data.id.toString()
        const team = await prisma.team.create({
            data: {
                id: data.id,
                display_number,
                team_name: data.team_name ?? 'Team ' + display_number,
                robot_name: data.robot_name,
                has_card: false
            }
        })
        io.emit('team', team)
    })

    socket.on('startMatch', async (id) => {
        if (id != eventState.loadedMatch) {
            alert('Attempted to start a non-loaded match')
            return
        }
        const match = await prisma.match.update({
            where: { id },
            data: {
                startTime: Date.now(),
                state: 'in_progress'
            }
        })

        io.emit('match', match)
    })
    socket.on('abortMatch', async (id) => {
        if (id != eventState.loadedMatch) {
            alert('Attempted to abort a non-loaded match')
            return
        }
        const match = await prisma.match.update({
            where: { id },
            data: {
                startTime: 0,
                state: 'not_started'
            }
        })
        io.emit('abortMatch', match)
    })

    socket.on('commitMatch', async (id) => {
        const match = await prisma.match.update({
            where: { id },
            data: {
                state: 'posted'
            }
        })

        const { red, blue } = getAlliances(match)
        red.concat(blue).forEach(({ team: team_number, card }) => {
            setTimeout(async () => {
                if (card == 'none') {
                    return
                }
                const team = await prisma.team.update({
                    where: { id: team_number },
                    data: {
                        has_card: true
                    }
                })
                logger.info('Committing', card, 'card for', team)
                io.emit('team', team)
            })
        })
        logger.info('Committing', id)
        setTimeout(tba.updateMatches)

        io.to('dashboard').emit('match', match)
    })

    socket.on('nextMatch', async (type) => {
        const newmatch = await matchmanager.advanceMatches(
            type as 'elimination' | 'qualification'
        )
        if (newmatch != null) {
            io.emit('match', newmatch)
        }
    })

    socket.on('resetMatch', async (id) => {
        const match = await matchmanager.getMatch(id)
        logger.warn('Resetting match', id)
        match.state = 'not_started'
        match.startTime = 0
        match.blue_scores = getBlankScoreBreakdown()
        match.red_scores = getBlankScoreBreakdown()
        io.emit('match', match)
    })

    socket.on('partialEvent', async (data) => {
        console.info('recieved partial event', data)
        if (data.atLunch != null) {
            eventState.atLunch = data.atLunch
        }
        if (data.lunchReturnTime != null) {
            eventState.lunchReturnTime = data.lunchReturnTime
        }
        io.emit('event', {
            atLunch: eventState.atLunch,
            lunchReturnTime: eventState.lunchReturnTime
        })
    })

    socket.on('disconnect', () => {
        logger.info('disconnected', socket.id, socket.handshake.auth.role)
    })

    function alert(...message: string[]) {
        logger.warn('ALERT', ...message)
        socket.emit('alert', message.join(' '))
    }
}
