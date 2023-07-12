import { derived, writable, type Readable, type Writable } from "svelte/store";
import { MatchState, type MatchData, MatchPeriod, type ExtendedTeam, type DSStatuses } from '@fowltypes';
import { FowlMatchStore, getFowlTeamStore, getReadonlyStore, gettableStore, SocketDataStore, type WritableTeamData } from "./socketStore";
import { getMatchPeriod, getRemainingTimeInPeriod, getElapsedTimeInPeriod, getRemainingTimeInDisplayPeriod } from "@fowlutils/match_timer";
import socket from "@socket";
import type { AllianceStationStatus, EventInfo, ExtendedDsStatuses } from "@fowltypes";



let currentMatchID:string = ""
let serverTimeOffset:number = 0;

let listenForPreload:boolean = false;
const preloadedMatch = gettableStore("")
const loadedMatch = gettableStore("")
export function setPreloadingTrack(shouldPreload:boolean) {
    listenForPreload = shouldPreload;
    matchDataPrivate.id.set((shouldPreload ? preloadedMatch : loadedMatch).get())
}

const matchDataPrivate: { [key in keyof MatchData]: FowlMatchStore<key, MatchData[key]> } = {
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
export const remainingTimeInDisplayPeriod = derived(matchTime, ($time) => {return getRemainingTimeInDisplayPeriod($time)});
export const elapsedTimeInPeriod = derived(matchTime, ($time) => getElapsedTimeInPeriod($time));


export function isMatchLoaded(match:string) {return match == loadedMatch.get()}
export function isMatchPreloaded(match:string) {return match == preloadedMatch.get()}

export const matchList:Writable<{[key:string]:MatchData}> = writable({})
export const teamList:Writable<{[key:number]:WritableTeamData}> = writable({})
export const teamsSorted:Readable<WritableTeamData[]> = derived(teamList, ($teams) =>
    (Object.values($teams) ?? []).sort(
            (a, b) => b.matchStats.get().rp - a.matchStats.get().rp
        )
    );
export const teamRankings:Readable<{[key:number]:number}> = derived(teamsSorted, ($teams) => {
    let map:{[key:number]:number} = {};
    ($teams ?? []).forEach((team, index, _array) => {
        map[team.id] = index
    });
    return map;
})

export const dsStatuses:Writable<ExtendedDsStatuses> = writable()


export const eventData = new SocketDataStore<EventInfo>({
    lunchReturnTime: 0,
    atLunch:false
}, (data) => {
    socket.emit("partialEvent", data)
})

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
export function updateDSStatuses(data:ExtendedDsStatuses) {
    dsStatuses.set(data)
}

export function updateEventInfo(data:EventInfo) {
    eventData.setQuiet(data)
}
matchDataPrivate.id.subscribeLocal((value) => currentMatchID = value)

export function updateLoadedMatch(isPreload:boolean, data: MatchData) {
    if (isPreload) {
        preloadedMatch.set(data.id);
    } else {
        loadedMatch.set(data.id);
    }
    currentMatchID = (listenForPreload ? preloadedMatch : loadedMatch).get()
    updateMatchStores(data)
}

export const loadedMatches = {
    preloaded:getReadonlyStore(preloadedMatch),
    loaded:getReadonlyStore(loadedMatch),
}

export function updateTeamList(data:{[key:number]:ExtendedTeam}) {
    teamList.update((list) => {
        list = {}
        Object.values(data).forEach(element => {
            list[element.id] = getFowlTeamStore(element)
        });
        console.log("TEMAUD", list)
        return list
    })
}
export function updateTeamStores(data:ExtendedTeam) {
    teamList.update((list) => {
        if (list[data.id]==null) {
            list[data.id] = getFowlTeamStore(data)
        } else {
            list[data.id].setQuiet(data)
        }
        return list;
    })
    
    
}

export function updateMatchList(data:{[key:string]:MatchData}) {
    console.log(data)
    matchList.set(data)
}
export function updateMatchStores(data: MatchData) {
    matchList.update((list) => {list[data.id] = data; return list})
    if (data.id !== currentMatchID) { return }
    Object.entries(matchDataPrivate).forEach(([key, store]) => {
        (store as FowlMatchStore<any, any>).setQuiet(data[key])
    })
}


const matchData: { [key in keyof MatchData]: Writable<MatchData[key]> } = {
    ...matchDataPrivate,
    // state:matchDataPrivate.state
}
export default matchData