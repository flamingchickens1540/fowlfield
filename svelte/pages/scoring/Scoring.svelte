<script context="module" lang="ts">
    import MatchScoring from './components/MatchScoring.svelte'
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    import { getCookie, setCookie } from 'typescript-cookie'

    let station = window.location.search.match(/^\?([\w\d]+)$/)?.[1] ?? getCookie('refpanel_station')
    let parsed = station?.match(/^(red|blue)(\d)$/)
    if (station == null || parsed == null) {
        station = 'red1'
        parsed = ['', 'red', '1']
        window.location.search = station
    }

    const stationnum = parseInt(parsed[2]) as 1 | 2 | 3
    const alliance = parsed[1] as 'red' | 'blue'
    setCookie('refpanel_station', station, { expires: 365, path: '/scoring' })
    onMount(() => {
        const initialSize = window.visualViewport!.height
        window.visualViewport!.addEventListener('scroll', (e) => {
            if (window.visualViewport!.height == initialSize && window.scrollY != 0) {
                window.scrollTo(0, 0)
            }
        })
        document.addEventListener(
            'dblclick',
            function (event) {
                event.preventDefault()
            },
            { passive: false }
        )
    })
    document.addEventListener('click', () => console.log('CLICK'))
    document.addEventListener('dblclick', () => console.log('DOUBLECLICK'))
</script>

<MatchScoring {alliance} station={stationnum}></MatchScoring>

<style lang="scss">
    :global(:root) {
        touch-action: none;
        height: 100%;
        overscroll-behavior-y: none;
    }

    :global(body) {
        margin: 0 !important;
        padding: 0;
    }
</style>
