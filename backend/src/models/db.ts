import { mongo } from "../../secrets.json"
import mongoDB from "mongodb"
import { DBMatch } from "./matches";
import { ExtendedTeam, MatchData, PartialMatch, PartialTeam, TeamData } from "@fowltypes";
import { DBSettings, Settings } from "models/settings";
import { DBTeam, buildStats } from "models/teams";

const mongoURL = `mongodb://${mongo.username}:${mongo.password}@127.0.0.1:27017/${mongo.database}`
const mongoClient = new mongoDB.MongoClient(mongoURL);

let teams: mongoDB.Collection<TeamData>;
let matches: mongoDB.Collection<MatchData>;
let settings: mongoDB.Collection<{ key: string, value: string }>;

export async function connect() {
    await mongoClient.connect()
    teams = mongoClient.db().collection<TeamData>("teams");
    teams.createIndex({ id: 1 }, { unique: true })
    teams.createIndex({ alliance: 1 }, { unique: false })
    matches = mongoClient.db().collection<MatchData>("matches");
    matches.createIndex({ id: 1 }, { unique: true })
    settings = mongoClient.db().collection("settings");
    settings.createIndex({ key: 1 }, { unique: true })
}

export async function getMatches(): Promise<{ [key: string]: DBMatch }> {
    let result: { [key: string]: DBMatch } = {}
    for await (const match of matches.find()) {
        result[match.id] = new DBMatch(match as unknown as MatchData)
    }
    return result
}

export async function getTeamMatches(team: number): Promise<Pick<ExtendedTeam, "matches"> & Pick<ExtendedTeam, "matchStats">> {
    let teammatches: string[] = []
    let stats = {
        win: 0,
        loss: 0,
        tie: 0,
        rp: 0
    }
    
    for await (const match of matches.find({ $or: [{ red1: team }, { red2: team }, { red3: team }, { blue1: team }, { blue2: team }, { blue3: team }] })) {
        const isRed = team == match.red1 || team == match.red2 || team == match.red3;
        buildStats(match, isRed, stats)
        teammatches.push(match.id)
    }
    return {
        matches: teammatches,
        matchStats: stats
    }
}

export async function getTeams(): Promise<{ [key: string]: DBTeam }> {
    let result: { [key: string]: DBTeam } = {}
    for await (const team of teams.find()) {
        result[team.id] = new DBTeam(team as unknown as TeamData)
    }
    console.log(result)
    return result
}
export async function updateSetting<K extends keyof Settings, T extends Settings[K]>(key: K, value: T) {
    const resp = await settings.replaceOne({ key }, { key, value }, { upsert: true })
    if (!resp.acknowledged) {
        console.warn("Could not store setting", key, value)
    }
}

export async function readSettings() {
    const result: Settings = {
        loadedMatch: "",
        preloadedMatch: "",
    }
    for await (const setting of settings.find()) {
        result[setting.key] = setting.value
    }
    return result
}
export async function updateMatch(match: PartialMatch) {
    const resp = await matches.updateOne({ id: match.id }, { $set: match })
    if (!resp.acknowledged) {
        console.warn("Could not update match", match.id)
    }
}

export async function setMatch(match: MatchData) {
    const resp = await matches.replaceOne({ id: match.id }, match, { upsert: true })
    if (!resp.acknowledged) {
        console.warn("Could not store match", match.id)
    }
}


export async function updateTeam(team: PartialTeam) {
    const resp = await teams.updateOne({ id: team.id }, { $set: team })
    if (!resp.acknowledged) {
        console.warn("Could not update team", team.id)
    }
}

export async function setTeam(team: TeamData) {
    const resp = await teams.replaceOne({ id: team.id }, team, {upsert:true})
    if (!resp.acknowledged) {
        console.warn("Could not update team", team.id)
    }
}

export async function deleteTeam(id:number) {
    const resp = await teams.deleteOne({ id: id })
    if (!resp.acknowledged) {
        console.warn("Could not delete team", id)
    }
}