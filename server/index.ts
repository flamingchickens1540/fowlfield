import * as http from 'http'
import { createLogger } from '~/logger'
import startSockets from './sockets'
import express from 'express'
import { loadMatches } from '~/managers/matchmanager'
import * as tba from '~/tba'
import prisma from '~/managers/db'

const rootLogger = createLogger('root')

const app = express()
const server = http.createServer(app)

// await db.connect()
// await DBSettings.getInstance()
// await matchmanager.loadMatches()
// await teammanager.loadTeams()
await loadMatches()
startSockets(server)

setTimeout(async () => {
    if ((await prisma.playoffAlliance.count()) == 0) {
        await prisma.playoffAlliance.createMany({ data: [1, 2, 3, 4].map((i) => ({ seed: i })) })
    }
})
// await tba.reset("match") // TODO: Remove this when teams are finalized
setTimeout(async () => await tba.updateEventTeams(), 1000)
// await tba.updateAlliances()
// await tba.updateMatches()
// await tba.updateRankings()

app.use(express.static('public'))
app.use(express.static('dist'))

rootLogger.info('Starting node')

server.listen(3000)
