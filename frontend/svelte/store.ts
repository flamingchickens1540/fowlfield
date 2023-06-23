import { derived, writable, type Readable, type Writable } from "svelte/store";
import { MatchState, type ExtendedMatch } from '@fowltypes';
import { FowlMatchStore } from "./socketStore";
import { getMatchPeriod, getRemainingTimeInPeriod, getElapsedTimeInPeriod } from "@fowlutils/match_timer";
import { listen } from "svelte/internal";
import socket from "@socket";



let currentMatchID: string = ""
let serverTimeOffset:number = 0;

let listenForPreload:boolean = false;
let preloadedMatchId:string = ""
let loadedMatchId:string = ""

export function setPreloadingTrack(shouldPreload:boolean) {
    listenForPreload = shouldPreload;
    matchDataPrivate.id.set(shouldPreload ? preloadedMatchId : loadedMatchId)
}

const matchDataPrivate: { [key in keyof ExtendedMatch]: FowlMatchStore<key, ExtendedMatch[key]> } = {
    id: new FowlMatchStore("id", currentMatchID),
    startTime: new FowlMatchStore("startTime", 0),
    state: new FowlMatchStore("state", MatchState.PENDING),

    redScore: new FowlMatchStore("redScore", 0),
    blueScore: new FowlMatchStore("blueScore", 0),
    redAlliance: new FowlMatchStore("redAlliance", 0),
    blueAlliance: new FowlMatchStore("blueAlliance", 0),

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
    const interval = setInterval(() => { set(($time == 0 ? 0 : Date.now() - serverTimeOffset - $time) / 1000) }, 50) // TODO: tune time if needed
    return () => clearInterval(interval)
}, 0)

export const matchPeriod = derived(matchTime, ($time) => getMatchPeriod($time));
export const remainingTimeInPeriod = derived(matchTime, ($time) => {return getRemainingTimeInPeriod($time)});
export const elapsedTimeInPeriod = derived(matchTime, ($time) => getElapsedTimeInPeriod($time));


export const matchList:Writable<{[key:string]:ExtendedMatch}> = writable({})




export function updateTimeOffset(time:number) {
    serverTimeOffset = Date.now() - time
    console.log(serverTimeOffset)
}

export function startMatch() {
    socket.emit("startMatch", currentMatchID)
}

export function abortMatch() {
    socket.emit("abortMatch", currentMatchID)
}

export function commitMatch() {
    socket.emit("commitMatch", currentMatchID)
}


matchDataPrivate.id.subscribeLocal((value) => currentMatchID = value)

export function updateLoadedMatch(isPreload:boolean, data: ExtendedMatch) {
    if (isPreload) {
        preloadedMatchId = data.id;
    } else {
        loadedMatchId = data.id;
    }
    currentMatchID = listenForPreload ? preloadedMatchId : loadedMatchId;
    updateMatchStores(data)
}

export function updateMatchList(data:{[key:string]:ExtendedMatch}) {
    console.log(data)
    matchList.set(data)
}
export function updateMatchStores(data: ExtendedMatch) {
    matchList.update((list) => {list[data.id] = data; return list})
    if (data.id !== currentMatchID) { return }
    Object.entries(matchDataPrivate).forEach(([key, store]) => {
        (store as FowlMatchStore<any, any>).setQuiet(data[key])
    })
}


const matchData: { [key in keyof Omit<ExtendedMatch, "state">]: Writable<ExtendedMatch[key]> } & {state:Writable<MatchState>} = {
    ...matchDataPrivate,
    // state:matchDataPrivate.state
}
export default matchData