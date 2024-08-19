import type { Invalidator, Readable, Subscriber, Unsubscriber, Updater, Writable } from 'svelte/store'
import { writable } from 'svelte/store'

import type { ClientToServerEvents, EventInfo } from '~common/types'
import socket from '~/lib/socket'
import matchData from '~/lib/store'
import { Match, Team } from '@prisma/client'
import writableDerived from 'svelte-writable-derived'
import { getBlankEvent, getBlankMatch } from '~common/utils/blanks'

export interface GettableStore<T> extends Readable<T> {
    get(): T
}
export type WritableGettableStore<T> = GettableStore<T> & Writable<T>
export function getReadonlyStore<T>(store: GettableStore<T>): GettableStore<T> {
    return { subscribe: store.subscribe, get: store.get }
}

export function gettable<T, S extends Readable<T>>(store: S): S & { get(): T } {
    let value: T
    store.subscribe((v) => (value = v))
    return {
        get() {
            return value
        },
        ...store
    }
}

export function gettableStore<T>(initialValue: T): WritableGettableStore<T> {
    const store: Writable<T> = writable(initialValue)
    let value: T = initialValue
    store.subscribe((v) => (value = v))

    return {
        get(): T {
            return value
        },
        set: store.set,
        update: store.update,
        subscribe: store.subscribe
    }
}

export type SocketWritable<V> = WritableGettableStore<V> & {
    setLocal(value: V): void
    subscribeLocal(run: Subscriber<V>, invalidate?: ((value?: V | undefined) => void) | undefined): Unsubscriber
    setWritable(isWritable?: boolean): SocketWritable<V>
    getProperty<K extends keyof V>(key: K): WritableGettableStore<V[K]>
}
export type SocketWritableOf<T> = { [key in keyof T]: SocketWritable<T[key]> }

export function createPropertyStore<T, K extends keyof T>(parent: Writable<T>, key: K): WritableGettableStore<T[K]> {
    return gettable(
        writableDerived(
            parent,
            (value) => value[key],
            (value, parent) => {
                parent[key] = value
                return parent
            }
        )
    )
}
const blankMatch = getBlankMatch()
export function createFowlMatchStore<K extends keyof Match, V extends Match[K]>(key: K): SocketWritable<V> {
    return createSocketStore('partialMatch', blankMatch, key, () => ({ id: matchData.id.get() }))
}

export function createFowlTeamStore<K extends keyof Team, V extends Team[K]>(team: Team, key: K): SocketWritable<V> {
    return createSocketStore('partialTeam', team, key, () => ({ id: team.id }))
}

const blankEvent = getBlankEvent()
export function createFowlEventStore<K extends keyof EventInfo, V extends EventInfo[K]>(key: K): SocketWritable<V> {
    return createSocketStore('partialEvent', blankEvent, key, () => ({}))
}

export function createSocketStore<Event extends keyof ClientToServerEvents, P extends Parameters<ClientToServerEvents[Event]>[0], K extends keyof P, V extends P[K]>(
    event: keyof ClientToServerEvents,
    parent: P,
    key: K,
    identifiers: () => Partial<P>
): SocketWritable<V> {
    const initialValue = parent[key] as V
    let blockUpdates = true
    const store = gettableStore(initialValue)
    store.subscribe((value) => {
        if (!blockUpdates) {
            if (!isStoreWritable) {
                console.error('Attempted to update non-writable store', key, value)
                return
            }
            let sentValue = value

            console.info(initialValue, typeof initialValue, value, typeof value)
            if (typeof initialValue === 'number' && typeof value === 'string') {
                sentValue = parseInt(value) as V
            } else if (typeof initialValue === 'boolean' && typeof value === 'string') {
                sentValue = (value === 'true') as V
            }
            const ids = identifiers()
            const body = { ...ids, [key]: sentValue }
            console.debug('SENDING', { event, key, sentValue, body })

            socket.emit(event, body as any)
        } else {
            console.debug('RECIEVING', event, key, value)
        }
    })
    blockUpdates = false
    let isStoreWritable = false

    return <SocketWritable<V>>{
        get() {
            return store.get()
        },

        getProperty<K extends keyof V>(key: K): WritableGettableStore<V[K]> {
            return createPropertyStore(store, key)
        },

        setLocal(newValue: V) {
            blockUpdates = true
            if (newValue != store.get()) {
                store.set(newValue)
            }
            blockUpdates = false
        },

        setWritable(isWritable: boolean = true) {
            isStoreWritable = isWritable
            return this
        },

        set(value: V) {
            if (isStoreWritable) {
                store.set(value)
            } else {
                console.warn('Attempting to set readonly store', key)
            }
        },

        update(updater: Updater<V>) {
            if (isStoreWritable) {
                store.update(updater)
            } else {
                console.warn('Attempting to update readonly store', key)
            }
        },

        subscribe(run: Subscriber<V>, invalidate?: Invalidator<V>): Unsubscriber {
            return store.subscribe(run, invalidate)
        },

        subscribeLocal(run: Subscriber<V>, invalidate?: Invalidator<V>): Unsubscriber {
            return store.subscribe((value) => {
                if (!blockUpdates) {
                    run(value)
                }
            }, invalidate)
        }
    }
}
