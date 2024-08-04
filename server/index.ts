import * as http from 'http';
import {createLogger} from '~/logger';
import {DBSettings} from '~/models/settings';
import {matchmanager, teammanager} from "~/managers";
import * as tba from "~/tba";
import * as db from "./models/db";
import startSockets from "./sockets";

const rootLogger = createLogger("root")

const server = http.createServer()
export const isProduction = process.env.NODE_ENV === "production"



async function configure() {
    await db.connect()
    await DBSettings.getInstance()
    await matchmanager.loadMatches()
    await teammanager.loadTeams()
    
    
    startSockets(server)
    // await tba.reset("match") // TODO: Remove this when teams are finalized
    await tba.updateEventTeams()
    await tba.updateAlliances()
    await tba.updateMatches()
    await tba.updateRankings()

}


configure()



rootLogger.info("Starting node")

server.listen(3000)
