import { MatchData, TeamData } from '../types';

type Alliance = [number,number,number,number]
type Alliances = [Alliance, Alliance, Alliance, Alliance]

export function categorizeAlliances(teams:TeamData[]):Alliances {
    const alliances:Alliances = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
    teams.forEach((team) => {
        if (team.alliance == 0 || team.alliancePosition == 0) {return}
        alliances[team.alliance-1][team.alliancePosition-1] = team.id
    })
    return alliances
}



export function average(values:number[]) {
    if (values.length == 0) {return 0}
    let sum = 0
    values.forEach((value) => sum+=value)
    return sum / values.length
}


export function getCompLevel(match:MatchData):"qm"|"qf"|"sf"|"f" {
    if (match.type == "qualification") {return "qm"}
    if (match.elimRound == 4) {return "qf"}
    if (match.elimRound == 2) {return "sf"}
    if (match.elimRound == 1) {return "f"}
    console.warn("Unknown match type!")
    return null
}

export function getMatchTitle(match:MatchData):string {
    if (match.type == "qualification") {return `Quals ${match.matchNumber}`}
    return `Match ${match.matchNumber}`
}