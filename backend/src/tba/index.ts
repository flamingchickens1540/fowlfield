

import { MatchData, MatchID, MatchState, TeamData } from '@fowltypes';
import { categorizeAlliances, getMatchTitle } from '@fowlutils/index';
import { calculateScoringInfo } from '@fowlutils/scores';
import axios from "axios";
import crypto from "crypto";
import rootLogger from "logger";
import { getMatches } from "managers/matchmanager";
import { buildExtendedTeams, getTeams } from "managers/teammanager";
import { tba } from "../../secrets.json";
import { TbaAlliance, TbaEventInfo, TbaMatch, TbaPlayoffAlliances, TbaPlayoffType, TbaRanking, TbaRankings, TbaTeamNumber } from "./types";

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

async function post<E extends keyof Endpoints>(endpoint: E, body: Endpoints[E]):Promise<boolean> {
    const path = `/api/trusted/v1/event/${eventCode}/${endpoint}`
    const signature = crypto.createHash('md5').update(tba.secret + path + JSON.stringify(body)).digest('hex')
    let response;
    try {
        response = await http_client.post(path, body, {
            headers: {
                'X-TBA-Auth-Sig': signature
            }
        })
        logger.log(response.status, response.statusText, path, body)
        if (response.status == 200) {
            return true
        }
    } catch (e) {
        logger.error("Request to", path, "failed.", e.response?.status, e.response?.statusText, e.response?.data)
    }
    return false
}


export async function updateEventInfo(teams: TeamData[] = Object.values(getTeams())) {
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
        playoff_type: TbaPlayoffType.DOUBLE_ELIM_4_TEAM,
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

export async function updateAlliances():Promise<boolean> {
    const teams = Object.values(getTeams())
    const alliances = categorizeAlliances(teams)
    const body = alliances.map((alliance) => {
        const teams = alliance.map((team) => getTBATeamNumber(team))
        return teams.filter((element) => element != "frc0")
    })
    return await post("alliance_selections/update", body)
}

export async function reset(...fields: ('alliance' | 'team' | 'match' | 'ranking')[]) {
    if (fields.includes("alliance")) await post("alliance_selections/update", [])
    if (fields.includes("team")) await post("team_list/update", [])
    if (fields.includes("match")) await post("matches/delete", Object.values(getMatches()).map((match) => match.id.toLowerCase() as any))
    if (fields.includes("ranking")) await post("rankings/update", { breakdowns: [], rankings: [] })

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
        played: team.matchStats.loss + team.matchStats.win + team.matchStats.tie,
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
function matchToTBAMatch(match: MatchData): TbaMatch {
    const decodedMatchId = /(sf|qf|f)(\d+)m(\d+)/.exec(match.id)
    const { redBreakdown, redScore, blueBreakdown, blueScore } = calculateScoringInfo(match)

    return {
        comp_level: match.type == "qualification" ? "qm" : decodedMatchId[1] as any,
        set_number: match.type == "qualification" ? 1 : parseInt(decodedMatchId[2]),
        match_number: match.type == "qualification" ? match.matchNumber : parseInt(decodedMatchId[3]),
        score_breakdown: {
            red: {
                rp: redScore > blueScore ? redScore + blueScore : redScore,
                teleopPoints: redBreakdown.targetHits + redBreakdown.finalBunny,
                totalPoints: redScore,
                techFoulCount: 0, // TODO: Implement once penalties are done
                foulCount: 0,
                foulPoints: 0,
                adjustPoints: 0,
                mobilityRobot1: match.redScoreBreakdown.autoTaxiBonus[0] ? "Yes" : "No",
                mobilityRobot2: match.redScoreBreakdown.autoTaxiBonus[1] ? "Yes" : "No",
                mobilityRobot3: match.redScoreBreakdown.autoTaxiBonus[2] ? "Yes" : "No",
                autoMobilityPoints: redBreakdown.autoTaxi,
                endGameParkPoints: redBreakdown.endgamePark,
                autoPoints: redBreakdown.autoTaxi + redBreakdown.autoBunny

            },
            blue: {
                rp: blueScore > redScore ? redScore + blueScore : blueScore,
                teleopPoints: blueBreakdown.targetHits + blueBreakdown.finalBunny,
                totalPoints: blueScore,
                techFoulCount: 0, // TODO: Implement once penalties are done
                foulCount: 0,
                foulPoints: 0,
                adjustPoints: 0,
                mobilityRobot1: match.blueScoreBreakdown.autoTaxiBonus[0] ? "Yes" : "No",
                mobilityRobot2: match.blueScoreBreakdown.autoTaxiBonus[1] ? "Yes" : "No",
                mobilityRobot3: match.blueScoreBreakdown.autoTaxiBonus[2] ? "Yes" : "No",
                autoMobilityPoints: blueBreakdown.autoTaxi,
                endGameParkPoints: blueBreakdown.endgamePark,
                autoPoints: blueBreakdown.autoTaxi + blueBreakdown.autoBunny
            }
        },
        alliances: {
            red: new TbaAlliance(match.red1, match.red2, match.red3, redScore),
            blue: new TbaAlliance(match.blue1, match.blue2, match.blue3, blueScore)
        },
        time_string: new Date(match.startTime).toLocaleTimeString("en-us", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" }),
        // time_utc: new Date(match.matchStartTime).toISOString(),
        // time_utc:"2008-01-02T10:30:00.000Z",
        display_name: getMatchTitle(match)
    }
}
export async function updateMatches() {
    const data: TbaMatch[] = Object.values(getMatches())
        .filter((match) => match.state == MatchState.POSTED)
        .map(matchToTBAMatch)
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