import * as http from 'http'
import { createLogger } from '~/logger'
import startSockets from './sockets'
import express from 'express'
import { loadMatches } from '~/managers/matchmanager'

const rootLogger = createLogger('root')

const app = express()
const server = http.createServer(app)

// await db.connect()
// await DBSettings.getInstance()
// await matchmanager.loadMatches()
// await teammanager.loadTeams()
await loadMatches()
startSockets(server)
// await tba.reset("match") // TODO: Remove this when teams are finalized
// await tba.updateEventTeams()
// await tba.updateAlliances()
// await tba.updateMatches()
// await tba.updateRankings()

app.use(express.static('public'))
app.use(express.static('dist'))

rootLogger.info('Starting node')

server.listen(3000)
