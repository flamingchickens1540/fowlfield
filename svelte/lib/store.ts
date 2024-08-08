import {
    getElapsedTimeInPeriod,
    getMatchPeriod,
    getRemainingTimeInDisplayPeriod,
    getRemainingTimeInPeriod
} from '~common/utils/match_timer'
import { calculatePointsTotal } from '~common/utils/scores'
import socket from '~/lib/socket'
import { derived, type Readable, writable, type Writable } from 'svelte/store'
import { createFowlMatchStore, createFowlTeamStore, SocketWritable, SocketWritableOf } from './socketStore'
import { Match, Team } from '@prisma/client'

let serverTimeOffset: number = 0
let loadTrack: 'load' | 'preload' = 'load'


export function setPreloadingTrack(shouldPreload: boolean) {
    loadTrack = shouldPreload ? 'preload' : 'load'
    matchDataPrivate.id.set((shouldPreload ? loadedMatches.preloaded : loadedMatches.loaded))
}


const matchDataPrivate: SocketWritableOf<Match> = {
    id: createFowlMatchStore('id'),
    startTime: createFowlMatchStore('startTime'),
    state: createFowlMatchStore('state'),
    red_scores: createFowlMatchStore('red_scores'),
    blue_scores: createFowlMatchStore('blue_scores'),
    red1: createFowlMatchStore('red1'),
    red2: createFowlMatchStore('red2'),
    red3: createFowlMatchStore('red3'),
    blue1: createFowlMatchStore('blue1'),
    blue2: createFowlMatchStore('blue2'),
    blue3: createFowlMatchStore('blue3'),
    stage_index: createFowlMatchStore('stage_index'),
    type: createFowlMatchStore('type'),
    elim_info: createFowlMatchStore('elim_info')
}

export const matchTime = derived(matchDataPrivate.startTime, ($time, set) => {
    const interval = setInterval(() => {
        set(($time == null ? 0 : Date.now() - serverTimeOffset - $time) / 1000)
    }, 50) // TODO: tune time if needed
    return () => clearInterval(interval)
}, 0)

export const matchPeriod = derived(matchTime, ($time) => getMatchPeriod($time))
export const remainingTimeInPeriod = derived(matchTime, ($time) => {
    return getRemainingTimeInPeriod($time)
})
export const remainingTimeInDisplayPeriod = derived(matchTime, ($time) => {
    return getRemainingTimeInDisplayPeriod($time)
})
export const elapsedTimeInPeriod = derived(matchTime, ($time) => getElapsedTimeInPeriod($time))


export function isMatchLoaded(match: string) {
    return match == loadedMatches.loaded
}

export function isMatchPreloaded(match: string) {
    return match == loadedMatches.preloaded
}

export const matchList: Writable<{ [key: string]: Match }> = writable({})
export const teamList: Writable<{ [key: number]: SocketWritableOf<Team> }> = writable({})

// export const eventData = new SocketDataStore<EventInfo>({
//     lunchReturnTime: 0,
//     atLunch: false
// }, (data) => {
//     socket.emit("partialEvent", data)
// })

export function updateTimeOffset(serverTime: number) {
    serverTimeOffset = Date.now() - serverTime
}

export function startMatch() {
    socket.emit('startMatch', matchDataPrivate.id.get())
}

export function abortMatch() {
    socket.emit('abortMatch', matchDataPrivate.id.get())
}

export function commitMatch() {
    socket.emit('commitMatch', matchDataPrivate.id.get())
}

// export function updateEventInfo(data: EventInfo) {
//     eventData.setQuiet(data)
// }


export function updateLoadedMatch(loadType: 'preload' | 'load', data: Match) {
    if (loadType == 'preload') {
        loadedMatches.preloaded = data.id
    } else {
        loadedMatches.loaded = data.id
    }
    if (loadTrack == loadType) {
        updateStoredMatch(data)
    }
}

export const loadedMatches = {
    preloaded: '',
    loaded: ''
}


function createTeamStores(team: Team): SocketWritableOf<Team> {
    return {
        id: createFowlTeamStore(team, 'id'),
        display_number: createFowlTeamStore(team, 'display_number'),
        team_name: createFowlTeamStore(team, 'team_name'),
        robot_name: createFowlTeamStore(team, 'robot_name'),
        has_card: createFowlTeamStore(team, 'has_card')
    }
}

export function updateTeamList(data: { [key: number]: Team }) {
    teamList.update((list) => {
        list = {}
        Object.values(data).forEach(element => {
            list[element.id] = createTeamStores(element)
        })
        return list
    })
}

export function updateStoredTeam(data: Team) {
    teamList.update((list) => {
        if (list[data.id] == null) {
            list[data.id] = createTeamStores(data)
        } else {
            Object.entries(list[data.id]).forEach(([key, store]) => {
                (store as SocketWritable<unknown>).setLocal(data[key as keyof Team])
            })
        }
        return list
    })
}

export function updateMatchList(data: { [key: string]: Match }) {
    matchList.set(data)
}

export function updateStoredMatch(data: Match) {
    matchList.update((list) => {
        list[data.id] = data
        return list
    })
    Object.entries(matchDataPrivate).forEach(([key, store]) => {
        (store as SocketWritable<unknown>).setLocal(data[key as keyof Match])
    })
}


export const matchData: SocketWritableOf<Match> & { redScore: Readable<number>, blueScore: Readable<number> } = {
    ...matchDataPrivate,
    redScore: derived(matchDataPrivate.red_scores, calculatePointsTotal, 0),
    blueScore: derived(matchDataPrivate.blue_scores, calculatePointsTotal, 0)
}
export default matchData