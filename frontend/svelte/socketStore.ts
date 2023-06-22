import type { Subscriber, Unsubscriber, Readable, Updater, Writable } from "svelte/store";
import { get, writable } from "svelte/store"

import type { ExtendedMatch } from '@fowltypes';
import socket from "@socket";
import matchData from "@store";



// let activeMatchID:string = ""
// matchData.id.subscribe((value) => {
//     activeMatchID = value
// })

export class FowlMatchStore<K extends keyof ExtendedMatch, T extends ExtendedMatch[K]> implements Writable<T>{
    private key: K
    private value: Writable<T>
    private blockUpdates: boolean = false;

    constructor(key: K, initialValue: T, transformer: (value: T) => T = (v) => v) {
        this.key = key;
        this.blockUpdates = true;
        this.value = writable(initialValue)
        this.value.subscribe((value) => {
            if (!this.blockUpdates) {
                const sentValue = typeof initialValue === "number" && typeof value === "string" ? parseInt(value) as T : value
                socket.emit("partialMatch", { id: get(matchData.id), [this.key]: transformer(sentValue) })
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
        return { subscribe: this.subscribe }
    }


}

