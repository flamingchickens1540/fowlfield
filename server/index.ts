import * as http from 'http';
import {createLogger} from '~/logger';
import startSockets from "./sockets";
import express from 'express';

const rootLogger = createLogger("root")


const app = express()
const server = http.createServer(app)
export const isProduction = process.env.NODE_ENV === "production"


// await db.connect()
// await DBSettings.getInstance()
// await matchmanager.loadMatches()
// await teammanager.loadTeams()


startSockets(server)
// await tba.reset("match") // TODO: Remove this when teams are finalized
// await tba.updateEventTeams()
// await tba.updateAlliances()
// await tba.updateMatches()
// await tba.updateRankings()

app.use(express.static('public'))
app.use(express.static('dist'))

rootLogger.info("Starting node")

server.listen(3000)
