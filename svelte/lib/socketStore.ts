import type {Readable, Subscriber, Unsubscriber, Updater, Writable} from "svelte/store";
import {get, writable} from "svelte/store"

import type {ExtendedTeam, MatchData, TeamData, TeamMatchStats} from '~common/types';
import socket from "~/lib/socket";
import matchData from "~/lib/store";
import { Match } from '@prisma/client'


// let activeMatchID:string = ""
// matchData.id.subscribe((value) => {
//     activeMatchID = value
// })
export interface GettableStore<T> extends Readable<T>{
    get():T
}
export type WritableGettableStore<T> = GettableStore<T> & Writable<T>;
export function getReadonlyStore<T>(store:GettableStore<T>): GettableStore<T> {
    return {subscribe:store.subscribe, get:store.get}
}
export function gettableStore<T>(initialValue:T): WritableGettableStore<T>{
    const store:Writable<T> = writable(initialValue)
    let value:T = initialValue
    store.subscribe((v) => value = v)
    
    return {
        get():T {
            return value;
        },
        set:store.set,
        update:store.update,
        subscribe:store.subscribe
    }
}

export type WritableTeamData = {
    [Property in keyof Omit<TeamData, "id">]: WritableGettableStore<TeamData[Property]>;
} & {readonly id: number, setQuiet(value:ExtendedTeam): void, matchStats:GettableStore<TeamMatchStats>}

export function getFowlTeamStore(data:ExtendedTeam): WritableTeamData {
    const id = data.id
    const props = {
        name: gettableStore(data.name),
        displaynum: gettableStore(data.displaynum),
        robotname: gettableStore(data.robotname ?? ""),
        alliance: gettableStore(data.alliance),
        alliancePosition: gettableStore(data.alliancePosition),
        card: gettableStore(data.card),
    }

    const readonlyprops = {
        matchStats: gettableStore(data.matchStats),
    }
    let blockUpdates = true
    Object.entries(props).forEach(([property, store]) => {
        store.subscribe((value:string|(1|2|3|4|0)) => {
            if (!blockUpdates) {
                socket.emit("partialTeam", {id, [property]:value})
            }
        })
    })
    blockUpdates = false
    
    return {
        ...props,
        matchStats:getReadonlyStore(readonlyprops.matchStats),
        id,
        setQuiet(value){
            console.log("local updating team", id)
            blockUpdates = true
            props.name.set(value.name)
            props.displaynum.set(value.displaynum)
            props.robotname.set(value.robotname ?? "")
            props.alliance.set(value.alliance)
            props.alliancePosition.set(value.alliancePosition)
            readonlyprops.matchStats.set(value.matchStats)
            props.card.set(value.card)
            blockUpdates = false
        }

    }
    
}

type SocketWritable<V> = Writable<V> & {setQuiet(value:V):void, subscribeLocal(run:Subscriber<V>, invalidate?:((value?:V|undefined) => void) | undefined):Unsubscriber, getReadonly():Readable<V>}
type SocketWritableOf<T> = T extends object ? { [key in keyof T]: SocketWritableOf<T[key]> } : SocketWritable<T>
function createFowlMatchStore<P,K extends keyof P, V extends P[K]>(parent:P, key:K, initialValue: V): SocketWritableOf<V> {
    if (initialValue instanceof Object) {
        const store = {} as { [key in keyof V]: SocketWritableOf<V[key]> }
        Object.entries(initialValue).forEach(([key, value]) => {
            store[key as keyof V] = createFowlMatchStore(initialValue, key as keyof V, value) as SocketWritableOf<V[keyof V]>
        })
        return store
    }
    let blockUpdates = true;
    const store = writable(initialValue)
    store.subscribe((value) => {
        if (!blockUpdates) {
            const sentValue = typeof initialValue === "number" && typeof value === "string" ? parseInt(value) : value
            console.debug("SENDING MATCHDATA", key, sentValue)
            socket.emit("partialMatch", { id: get(matchData.id), [key]: sentValue})
        } else {
            console.debug("RECIEVING MATCHDATA", key, value)
        }
    })
    blockUpdates = false;
    
    return {
        setQuiet(newValue: V) {
            blockUpdates = true
            store.set(newValue)
            blockUpdates = false
        },

        set(value: V) {
            store.set(value)
        },

        update(updater: Updater<V>) {
            store.update(updater)
        },

        subscribe(run: Subscriber<V>, invalidate?: ((value?: V | undefined) => void) | undefined): Unsubscriber {
            return store.subscribe(run, invalidate)
        },

        subscribeLocal(run: Subscriber<V>, invalidate?: ((value?: V | undefined) => void) | undefined): Unsubscriber {
            return store.subscribe((value) => {
                if (!blockUpdates) {
                    run(value)
                }
            }, invalidate)
        },

        getReadonly(): Readable<V> {
            return {
                subscribe: (run: Subscriber<V>, invalidate?: ((value?: V | undefined) => void) | undefined): Unsubscriber => {
                    return store.subscribe(run, invalidate)
                }
            }
        }
    }
    
    
}


export class SocketDataStore<T> implements Writable<T> {
    private value: Writable<T>
    private blockUpdates: boolean = false;

    constructor(initialValue: T, silentCallback:(value:T) => void) {
        this.value = writable(initialValue)
        this.blockUpdates = true;
        this.value.subscribe((value) => {
            if (!this.blockUpdates) {
                silentCallback(value)
            }
        })
        this.blockUpdates = false;
    }

    setQuiet(value: T) {
        this.blockUpdates = true
        this.value.set(value)
        this.blockUpdates = false
    }
    
    set(value: T) {
        this.value.set(value)
    }
    
    update(updater: Updater<T>) {
        this.value.update(updater)
    }
    
    subscribe(run: Subscriber<T>, invalidate?: ((value?: T | undefined) => void) | undefined): Unsubscriber {
        return this.value.subscribe(run, invalidate)
    }
    
    subscribeLocal(run: Subscriber<T>, invalidate?: ((value?: T | undefined) => void) | undefined): Unsubscriber {
        return this.value.subscribe((value) => {
            if (!this.blockUpdates) {
                run(value)
            }
        }, invalidate)
    }
    
    getReadonly(): Readable<T> {
        return { 
            subscribe: (run: Subscriber<T>, invalidate?: ((value?: T | undefined) => void) | undefined): Unsubscriber => {
                return this.value.subscribe(run, invalidate)
            }
        }
    }
}
