<script lang="ts">
    import StoreView from './Store.svelte'
    import socket from '~//lib/socket'
    import type { DriverStation } from '~common/types'
    import { writable } from 'svelte/store'

    const redBucketStore = writable(0)
    const blueBucketStore = writable(0)
    const bothStore = writable(0)
    redBucketStore.subscribe(($redBucketStore) => {
        console.log(redBucketStore)
        socket.emit('setBuckets', ['R1', 'R2', 'R3'] as DriverStation[], $redBucketStore || 0)
    })
    blueBucketStore.subscribe(($blueBucketStore) => {
        console.log(blueBucketStore)
        socket.emit('setBuckets', ['B1', 'B2', 'B3'] as DriverStation[], $blueBucketStore || 0)
    })

    bothStore.subscribe(($bothStore) => {
        redBucketStore.set($bothStore)
        blueBucketStore.set($bothStore)
    })
</script>

<div>
    <StoreView key="RedBuckets" store={redBucketStore}></StoreView>
    <StoreView key="BlueBuckets" store={blueBucketStore}></StoreView>
    <StoreView key="AllBuckets" store={bothStore}></StoreView>
</div>
