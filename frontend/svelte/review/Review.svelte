<script lang="ts">
	import matchData from "@store";
	const { redScoreBreakdown, blueScoreBreakdown } = matchData;
	import Foul from "./components/Foul.svelte";
	import CustomFoul from "./components/CustomFoul.svelte";
	import { calculatePointBreakdown } from "@fowlutils/scores";
</script>

<main>
	<h1>Teams</h1>
	
	<div class="reviewcontainer">
		<div>
			<h2>Red Bunnies</h2>
			<h4>Auto</h4>
			<div class=bunnycounter>
				<button class="red-button" on:click={() => $redScoreBreakdown.autoBunnyCount--}>-</button>
				<input type="number" bind:value={$redScoreBreakdown.autoBunnyCount} />
				<button class="green-button" on:click={() => $redScoreBreakdown.autoBunnyCount++}>+</button>
			</div>
			<h4>Endgame</h4>
			<div class=bunnycounter>
				<button class="red-button" on:click={() => $redScoreBreakdown.finalBunnyCount--}>-</button>
				<input type="number" bind:value={$redScoreBreakdown.finalBunnyCount} />
				<button class="green-button" on:click={() => $redScoreBreakdown.finalBunnyCount++}>+</button>
			</div>
		</div>
		<div>
			<h2>Blue Bunnies</h2>
			<h4>Auto</h4>
			<div class=bunnycounter>
				<button class="red-button" on:click={() => $blueScoreBreakdown.autoBunnyCount--}>-</button>
				<input type="number" bind:value={$blueScoreBreakdown.autoBunnyCount} />
				<button class="green-button" on:click={() => $blueScoreBreakdown.autoBunnyCount++}>+</button>
			</div>
			<h4>Endgame</h4>
			<div class=bunnycounter>
				<button class="red-button" on:click={() => $blueScoreBreakdown.finalBunnyCount--}>-</button>
				<input type="number" bind:value={$blueScoreBreakdown.finalBunnyCount} />
				<button class="green-button" on:click={() => $blueScoreBreakdown.finalBunnyCount++}>+</button>
			</div>
		</div>
	</div>
	<div class="reviewcontainer">
		<div>
			<h2>Fouls from Red ({calculatePointBreakdown($blueScoreBreakdown).foulPoints}pts)</h2>
			{#each $blueScoreBreakdown.fouls as foul, i}
			<!-- Fouls giving points to the red alliance-->
			<Foul {foul} color="#662a2a" />
			{/each}
			<CustomFoul breakdown={blueScoreBreakdown} />
		</div>
		<div>
			<h2>Fouls from Blue ({calculatePointBreakdown($redScoreBreakdown).foulPoints}pts)</h2>
			{#each $redScoreBreakdown.fouls as foul, i}
			<!-- Fouls giving points to the blue alliance-->
			
			<Foul {foul} color="#2a2d66" />
			{/each}
			<CustomFoul breakdown={redScoreBreakdown} />
		</div>
	</div>

	<div class="reviewcontainer">
		// TODO: Implement
		<div>
			<h2>Cards against red</h2>
		</div>
		<div>
			<h2>Cards against blue</h2>
		</div>
	</div>
	
	
</main>

<style lang="scss">
	.reviewcontainer {
		display:grid;
		grid-template-columns: auto auto;
		margin-bottom: 30px;
	}
	.bunnycounter {
		.red-button {
			background-color: #710000;
		}
		.green-button {
			background-color: #004e00;
		}
		& > *{
			font-size:20px;
			height:50px;
		}
	}
</style>
