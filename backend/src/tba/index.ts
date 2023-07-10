

import axios from "axios"
import {tba} from "../../secrets.json"
import crypto from "crypto"
import { TbaTeamNumber, TbaEventInfo, TbaPlayoffAlliances, TbaMatch, TbaRankings, TbaRanking, TbaAlliance, TbaPlayoffType } from "./types"
import { MatchState, MatchData, MatchID, TeamData } from '@fowltypes';
import { categorizeAlliances, getCompLevel, getMatchTitle } from '@fowlutils/index';
import { buildStats } from "models/teams";
import { buildExtendedTeams, getTeams } from "teammanager";
import rootLogger from "logger";
import { getMatches } from "matchmanager";

const logger = rootLogger.getLogger("tba")

const isEnabled = (tba.id ?? "") != "" && (tba.secret ?? "") != ""

const baseUrl = "https://www.thebluealliance.com"
const eventCode = "2023orbb"

const http_client = axios.create({
    baseURL: baseUrl,
    headers: {
        'X-TBA-Auth-Id': tba.id,

    }
})

function isTBATeamNumber(obj: unknown): obj is TbaTeamNumber {
    return obj.toString().startsWith("frc")
}
function getTBATeamNumber(teamNumber: number | string): TbaTeamNumber {
    return "frc" + teamNumber
}

interface Endpoints {
    "info/update": TbaEventInfo;
    "alliance_selections/update": TbaPlayoffAlliances;
    "awards/update": never;
    "matches/update": TbaMatch[];
    "matches/delete": MatchID[];
    "rankings/update": TbaRankings;
    "team_list/update": TbaTeamNumber[];
    "media/add": never;
}

async function post<E extends keyof Endpoints>(endpoint: E, body: Endpoints[E]) {
    const path = `/api/trusted/v1/event/${eventCode}/${endpoint}`
    const signature = crypto.createHash('md5').update(tba.secret + path + JSON.stringify(body)).digest('hex')
    let response;
    try {
        response = await http_client.post(path, body, {
            headers: {
                'X-TBA-Auth-Sig': signature
            }
        })
        logger.log(response.status, response.statusText, path)
    } catch (e) {
        logger.error("Request to", path, "failed.", e.response?.status, e.response?.statusText, e.response?.data)
    }
}


export async function updateEventInfo(teams: TeamData[]=Object.values(getTeams())) {
    const remap_teams = {}
    teams.forEach(({ id, displaynum }) => {
        if (id.toString() != displaynum && !displaynum.endsWith("A")) {
            remap_teams[getTBATeamNumber(id)] = getTBATeamNumber(displaynum)
        }
    })

    const body: TbaEventInfo = {
        first_code: null,
        webcasts: [
            // { url: "https://team1540.org/bunnybots" }
        ],
        playoff_type:TbaPlayoffType.DOUBLE_ELIM_4_TEAM,
        remap_teams
    }

    await post("info/update", body)
}

export async function updateEventTeams() {
    const teams = Object.values(getTeams())
    const body: TbaTeamNumber[] = teams.map(({ id }) => getTBATeamNumber(id))
    await post("team_list/update", body)
    await updateEventInfo(teams)
}

export async function updateAlliances() {
    const teams = Object.values(getTeams())
    const alliances = categorizeAlliances(teams)
    const body = alliances.map((alliance) => {
        const teams = alliance.map((team) => getTBATeamNumber(team))
        
        return teams.filter((element) => element != "frc0").reverse()
    })
    await post("alliance_selections/update", body)
}

export async function reset(...fields:('alliance'|'team'|'match')[]) {
    if (fields.includes("alliance")) await post("alliance_selections/update", [])
    if (fields.includes("team")) await post("team_list/update", [])
    if (fields.includes("match")) await post("matches/delete", Object.values(getMatches()).map((match) => match.id as any))

}
export async function updateRankings() {
    const teams = Object.values(buildExtendedTeams())
    teams.sort((a, b) => b.matchStats.rp - a.matchStats.rp)
    const rankings: TbaRanking[] = teams.map((team, index) => ({
        team_key: getTBATeamNumber(team.id),
        rank: index + 1,
        wins: team.matchStats.win,
        losses: team.matchStats.loss,
        ties: team.matchStats.tie,
        played: team.matchStats.loss+team.matchStats.win+team.matchStats.tie,
        qual_average: 0,
        dqs: 0,
        "Ranking Score": team.matchStats.rp,
        "Avg Match": team.matchStats.avg_score,
        "Avg Charge Station": -1,
        "Avg Auto": 0
    }))

    const body: TbaRankings = {
        breakdowns: [
            "Ranking Score",
            "Avg Match",
            "Avg Charge Station",
            "Avg Auto"
        ],
        rankings
    }
    await post("rankings/update", body)
}

export async function updateMatches() {
    const data: TbaMatch[] = Object.values(getMatches())
        .filter((match) => match.state == MatchState.POSTED)
        .map((match) => {
            const decodedMatchId = /(sf|qf|f)(\d+)m(\d+)/.exec(match.id)
            const redWon =match.redScore > match.blueScore
            return {
                comp_level: match.type == "qualification" ? "qm":decodedMatchId[1] as any,
                set_number: match.type == "qualification" ? 1 : parseInt(decodedMatchId[2]),
                match_number: match.type == "qualification" ? match.matchNumber : parseInt(decodedMatchId[3]),
                score_breakdown: {
                    red: {
                        rp: match.redScore > match.blueScore ? match.redScore + match.blueScore : match.redScore,
                        teleopPoints: 0,
                        totalPoints: match.redScore,
                        techFoulCount:0,
                        foulCount: 0,
                        foulPoints: 0,
                        adjustPoints:0
                        
                    },
                    blue: {
                        rp: match.blueScore > match.redScore ? match.redScore + match.blueScore : match.blueScore,
                        teleopPoints: 0,
                        totalPoints: match.blueScore,
                        techFoulCount:0,
                        foulCount: 0,
                        foulPoints: 0,
                        adjustPoints:0
                    }
                },
                alliances: {
                    red: new TbaAlliance(match.red1, match.red2, match.red3, match.redScore),
                    blue: new TbaAlliance(match.blue1, match.blue2, match.blue3, match.blueScore)
                },
                time_string: new Date(match.startTime).toLocaleTimeString("en-us", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" }),
                // time_utc: new Date(match.matchStartTime).toISOString(),
                // time_utc:"2008-01-02T10:30:00.000Z",
                display_name: getMatchTitle(match)
            }
        })
    // resetMatches(matches)
    await post("matches/update", data)
}
export async function resetRankings() {
    const body: TbaRankings = {
        breakdowns: [],
        rankings: []
    }
    await post("rankings/update", body)
}

