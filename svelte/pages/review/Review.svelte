<script lang="ts">
	import matchData from "~/lib/store";
	import Foul from "./components/Foul.svelte";
	import CustomFoul from "./components/CustomFoul.svelte";
	import {calculatePointsTotal, calculateScoreBreakdown} from "~common/utils/scores";
	import Card from "./components/Card.svelte";

	const { redScoreBreakdown, blueScoreBreakdown } = matchData;
</script>

<main>
	<h1>Match Review</h1>
	<div class="reviewcontainer">
		<div>
			<h2>Red Points - {calculatePointsTotal($redScoreBreakdown)}</h2>
		</div>
		<div>
			<h2>Blue Points - {calculatePointsTotal($blueScoreBreakdown)}</h2>
		</div>
	</div>
	<div class="reviewcontainer">
		<div>
			<h2>Red Bunnies</h2>
			<h3>Auto</h3>
			<div class=bunnycounter>
				<button class="red-button" on:click={() => $redScoreBreakdown.autoBunnyCount--}>-</button>
				<input type="number" bind:value={$redScoreBreakdown.autoBunnyCount} />
				<button class="green-button" on:click={() => $redScoreBreakdown.autoBunnyCount++}>+</button>
			</div>
			<h3>Endgame</h3>
			<div class=bunnycounter>
				<button class="red-button" on:click={() => $redScoreBreakdown.finalBunnyCount--}>-</button>
				<input type="number" bind:value={$redScoreBreakdown.finalBunnyCount} />
				<button class="green-button" on:click={() => $redScoreBreakdown.finalBunnyCount++}>+</button>
			</div>
		</div>
		<div>
			<h2>Blue Bunnies</h2>
			<h3>Auto</h3>
			<div class=bunnycounter>
				<button class="red-button" on:click={() => $blueScoreBreakdown.autoBunnyCount--}>-</button>
				<input type="number" bind:value={$blueScoreBreakdown.autoBunnyCount} />
				<button class="green-button" on:click={() => $blueScoreBreakdown.autoBunnyCount++}>+</button>
			</div>
			<h3>Endgame</h3>
			<div class=bunnycounter>
				<button class="red-button" on:click={() => $blueScoreBreakdown.finalBunnyCount--}>-</button>
				<input type="number" bind:value={$blueScoreBreakdown.finalBunnyCount} />
				<button class="green-button" on:click={() => $blueScoreBreakdown.finalBunnyCount++}>+</button>
			</div>
		</div>
	</div>
	<div class="reviewcontainer">
		<div>
			<h2>Fouls from Red ({calculateScoreBreakdown($blueScoreBreakdown).foulPoints}pts)</h2>
			{#each $blueScoreBreakdown.fouls as foul, i}
			<!-- Fouls giving points to the red alliance-->
			<Foul {foul} color="#662a2a" />
			{/each}
			<CustomFoul breakdown={blueScoreBreakdown} />
		</div>
		<div>
			<h2>Fouls from Blue ({calculateScoreBreakdown($redScoreBreakdown).foulPoints}pts)</h2>
			{#each $redScoreBreakdown.fouls as foul, i}
			<!-- Fouls giving points to the blue alliance-->
			
			<Foul {foul} color="#2a2d66" />
			{/each}
			<CustomFoul breakdown={redScoreBreakdown} />
		</div>
	</div>

	<div class="reviewcontainer">
		<div>
			<h2>Red Alliance Misc</h2>
			<div style="display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;height:500px">
				<Card isRedAlliance={true} stationid={1}></Card>
				<Card isRedAlliance={true} stationid={2}></Card>
				<Card isRedAlliance={true} stationid={3}></Card>
			</div>
		</div>
		<div>
			<h2>Blue Alliance Misc</h2>
			<div style="display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;height:500px">
			<Card isRedAlliance={false} stationid={1}></Card>
			<Card isRedAlliance={false} stationid={2}></Card>
			<Card isRedAlliance={false} stationid={3}></Card>
			</div>
		</div>
	</div>

</main>

<style lang="scss">
	main {
		padding-bottom:50px;
	}
	.reviewcontainer {
		display:grid;
		grid-template-columns: 1fr 1fr;
		margin-bottom: 30px;
		> * {
			&:nth-child(1) {
				background-color: #380000;
			}

			&:nth-child(2) {
				background-color: #001638;
			}
			border: 1px white dashed;
		}
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

	:global(:root) {
		touch-action: pan-y;
		height: 100%;
	}

	:global(body) {
		margin: 0 !important;
		padding: 0;
	}
</style>
