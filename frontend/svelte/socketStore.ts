import type { Subscriber, Unsubscriber, Readable, Updater, Writable } from "svelte/store";
import { get, writable } from "svelte/store"

import type { MatchData, TeamData } from '@fowltypes';
import socket from "@socket";
import matchData from "@store";



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
} & {readonly id: number, setQuiet(value:TeamData): void}

export function getFowlTeamStore(data:TeamData): WritableTeamData {
    const id = data.id
    const props = {
        name: gettableStore(data.name),
        displaynum: gettableStore(data.displaynum),
        robotname: gettableStore(data.robotname ?? ""),
        alliance: gettableStore(data.alliance),
        alliancePosition: gettableStore(data.alliancePosition),
    }
    let blockUpdates = true
    Object.entries(props).forEach(([property, store]) => {
        store.subscribe((value:string|(1|2|3|4|0)) => {
            if (!blockUpdates) {
                socket.emit("partialTeam", {id, [property]:value})
            } else {
                console.log("not broadcasting team", id)
            }
        })
    })
    blockUpdates = false
    
    return {
        ...props,
        id,
        setQuiet(value){
            console.log("local updating team", id)
            blockUpdates = true
            props.name.set(value.name)
            props.displaynum.set(value.displaynum)
            props.robotname.set(value.robotname ?? "")
            props.alliance.set(value.alliance)
            props.alliancePosition.set(value.alliancePosition)
            blockUpdates = false
        }

    }
    
}

export class FowlMatchStore<K extends keyof MatchData, T extends MatchData[K]> implements Writable<T>{
    private key: K
    private value: Writable<T>
    private blockUpdates: boolean = false;
    
    constructor(key: K, initialValue: T) {
        this.key = key;
        this.blockUpdates = true;
        this.value = writable(initialValue)
        this.value.subscribe((value) => {
            if (!this.blockUpdates) {
                
                const sentValue = typeof initialValue === "number" && typeof value === "string" ? parseInt(value) as T : value
                console.log("sending", value, sentValue)
                socket.emit("partialMatch", { id: get(matchData.id), [this.key]: sentValue})
            } else {console.log("not updating")}
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

