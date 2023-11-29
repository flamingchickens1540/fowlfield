<script context=module lang=ts>
    import type {DriverStation} from "@fowltypes";
    import MatchScoring from "./components/MatchScoring.svelte";

    export const driverstations: { [key in `${"red" | "blue"}${1 | 2 | 3}`]: DriverStation } = {
        red1: "R1",
        red2: "R2",
        red3: "R3",
        blue1: "B1",
        blue2: "B2",
        blue3: "B3"
    }
</script>
<script lang=ts>
    import {getCookie, setCookie} from "typescript-cookie";
    import {onMount} from "svelte/internal";

    let station = window.location.pathname.match(/\/scoring\/([\w\d]+)$/)?.[1] ?? getCookie("refpanel_station")

    if (station == null || driverstations[station] == null) {
        station = 'red1'
        window.history.replaceState(null, '', '/scoring/' + station);
    }

    const parsed = station.match(/^(\w+)(\d)$/)
    const stationnum = parseInt(parsed[2]) as 1 | 2 | 3
    const alliance = parsed[1] as "red" | "blue"
    setCookie("refpanel_station", station, {expires: 365, path: "/scoring"})
    onMount(() => {
        document.addEventListener('dblclick', function (event) {
            event.preventDefault();
        }, {passive: false});
    })
</script>
<MatchScoring {alliance} station={stationnum}></MatchScoring>


<style lang=scss>
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