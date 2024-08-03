<script lang="ts">
    import type {ScoreBreakdown} from "~common/types";
    import type {Writable} from "svelte/store";

    let pointValue: number = 0;
	export let breakdown: Writable<ScoreBreakdown>;
	function add() {
		breakdown.update((breakdown) => {
			breakdown.fouls.push({ robot: 0, timestamp: Date.now(), value: pointValue });
			return breakdown;
		});
	}
</script>

<input type="number" style="height:40px;font-size:16px" bind:value={pointValue} />
<button on:click={add}>Add New</button>
