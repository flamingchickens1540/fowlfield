import { Writable } from "svelte/store";
import { ExtendedMatch } from '../../types/types';
import { FowlMatchStore } from "./socketStore";



let currentMatchID:string = ""
export function getCurrentMatchID() {
    return this.currentMatchID
}


const matchDataPrivate: { [key in keyof ExtendedMatch]: FowlMatchStore<key, ExtendedMatch[key]> } = {
    redScore: new FowlMatchStore("redScore", 0),
    blueScore: new FowlMatchStore("blueScore", 0),
    id: new FowlMatchStore("id", currentMatchID),
    matchNumber: new FowlMatchStore("matchNumber", 0),
    elimRound: new FowlMatchStore("elimRound", 0),
    elimGroup: new FowlMatchStore("elimGroup", 0),
    elimInstance: new FowlMatchStore("elimInstance", 0),
    type: new FowlMatchStore("type", "qualification"),
    red1: new FowlMatchStore("red1", 0),
    red2: new FowlMatchStore("red2", 0),
    red3: new FowlMatchStore("red3", 0),
    blue1: new FowlMatchStore("blue1", 0),
    blue2: new FowlMatchStore("blue2", 0),
    blue3: new FowlMatchStore("blue3", 0),
};

matchDataPrivate.id.subscribeLocal((value) => currentMatchID = value)

export function updateCurrentMatch(data:ExtendedMatch) {
    currentMatchID = data.id;
    updateMatchStores(data)
}
export function updateMatchStores(data:ExtendedMatch) {
    if (data.id !== currentMatchID) {return}
    Object.entries(matchDataPrivate).forEach(([key, store]) => {
        (store as FowlMatchStore<any,any>).setQuiet(data[key])
    })
}


const matchData:{ [key in keyof ExtendedMatch]: Writable<ExtendedMatch[key]> } = matchDataPrivate
export default matchData