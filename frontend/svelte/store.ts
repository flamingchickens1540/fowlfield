import { derived, type Writable } from "svelte/store";
import type { ExtendedMatch } from '@fowltypes';
import { FowlMatchStore } from "./socketStore";
import { getMatchState, getRemainingTimeInPeriod, getElapsedTimeInPeriod } from "@fowlutils/match_timer";



let currentMatchID: string = ""




const matchDataPrivate: { [key in keyof ExtendedMatch]: FowlMatchStore<key, ExtendedMatch[key]> } = {
    id: new FowlMatchStore("id", currentMatchID),
    startTime: new FowlMatchStore("startTime", 0),

    redScore: new FowlMatchStore("redScore", 0),
    blueScore: new FowlMatchStore("blueScore", 0),

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
export const matchTime = derived(matchDataPrivate.startTime, ($time, set) => {
    const interval = setInterval(() => { set((Date.now() - $time) / 1000) }, 50) // TODO: tune time if needed
    return () => clearInterval(interval)
}, 0)

export const matchPeriod = derived(matchTime, ($time) => getMatchState($time));
export const remainingTimeInPeriod = derived(matchTime, ($time) => getRemainingTimeInPeriod($time));
export const elapsedTimeInPeriod = derived(matchTime, ($time) => getElapsedTimeInPeriod($time));

matchDataPrivate.id.subscribeLocal((value) => currentMatchID = value)

export function updateCurrentMatch(data: ExtendedMatch) {
    currentMatchID = data.id;
    updateMatchStores(data)
}
export function updateMatchStores(data: ExtendedMatch) {
    if (data.id !== currentMatchID) { return }
    Object.entries(matchDataPrivate).forEach(([key, store]) => {
        (store as FowlMatchStore<any, any>).setQuiet(data[key])
    })
}


const matchData: { [key in keyof ExtendedMatch]: Writable<ExtendedMatch[key]> } = {
    ...matchDataPrivate
}
export default matchData