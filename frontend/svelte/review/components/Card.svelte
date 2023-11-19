<script lang=ts>
    import matchData from "@store";
	import type { Writable } from "svelte/store";
    export let isRedAlliance:boolean
    export let stationid:0|1|2

    const pos = (isRedAlliance ? "red" : "blue") + stationid
    const robot:Writable<number> = matchData[pos]
</script>

<button></button>