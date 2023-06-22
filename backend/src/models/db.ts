import {mongo} from "../../secrets.json"
import mongoDB from "mongodb"
import { DBMatch } from "./matches";
import { ExtendedMatch, PartialMatch } from "@fowltypes";

const mongoURL = `mongodb://${mongo.username}:${mongo.password}@127.0.0.1:27017/${mongo.database}`
const mongoClient =  new mongoDB.MongoClient(mongoURL);

let teams:mongoDB.Collection<mongoDB.BSON.Document>;
let matches:mongoDB.Collection<mongoDB.BSON.Document>;

export async function connect() {
    await mongoClient.connect()
    teams = mongoClient.db().collection("teams");
    teams.createIndex({id:1}, {unique:true})
    matches = mongoClient.db().collection("matches");
    matches.createIndex({id:1}, {unique:true})
}

export async function getMatches():Promise<{[key:string]:DBMatch}> {
    let result:{[key:string]:DBMatch} = {}
    for await (const match of matches.find()) {
        result[match.id] = new DBMatch(match as unknown as ExtendedMatch)
    }
    return result
}

export async function updateMatch(match:PartialMatch) {
    const resp = await matches.updateOne({id:match.id},{$set: match})
    if (!resp.acknowledged) {
        console.warn("Could not update match", match.id)
    }
}

export async function setMatch(match:ExtendedMatch) {
    const resp = await matches.replaceOne({id:match.id},match, {upsert:true})
    if (!resp.acknowledged) {
        console.warn("Could not store match", match.id)
    }
}