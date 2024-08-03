<script lang="ts">
	import type {Foul} from "~common/types";
	import matchData, {teamList} from "~/lib/store";
	import {formatDuration} from "~common/utils/format";

	const startTime = matchData.startTime
	export let foul:Foul
	export let color:string
	const robot = ($teamList[foul.robot]?.displaynum?.get() ?? foul.robot) || "Unknown"
	function removeFoul() {
		matchData.redScoreBreakdown.update((breakdown) => {
			breakdown.fouls = breakdown.fouls.filter((f) => f != foul)
			return breakdown
		})

		matchData.blueScoreBreakdown.update((breakdown) => {
			breakdown.fouls = breakdown.fouls.filter((f) => f != foul)
			return breakdown
		})
	}
	$: time = (foul.timestamp - $startTime)/1000 < 300 ? formatDuration((foul.timestamp - $startTime)/1000) : "Post Match"

</script>
<div class=gridrow style="--bgcolor:{color}">
	<div>
	<span style="display:inline-block;width:80px;text-align:end">{time}</span>
	<span style="display:inline-block;width:70px;text-align:start"> - {foul.value}pts</span>
	<span> - {robot}</span>
</div>
	<div>
	<button on:click={removeFoul}>X</button>
</div>
</div>
<style lang="scss">
	.gridrow {
		width:80%;
		height:30px;
		display:flex;
		justify-content: space-between;
		align-items: center;
		span {
			white-space: pre;
		}
		background-color: var(--bgcolor);
		border-radius: 20px;
		margin: 5px auto;
		padding:10px;
	}
</style>
