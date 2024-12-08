<script lang="ts">
	import matchData from '~/lib/store'
	import Card from './components/Card.svelte'
	import { createPropertyStore, createSecondOrderPropertyStore } from '~/lib/socketStore'
	import Field from '~/pages/review/components/Field.svelte'
	import FieldCheckbox from '~/pages/review/components/FieldCheckbox.svelte'

	const { redScore, blueScore, scores, id } = matchData;
	scores.setWritable()
	const isCorralEmpty = createPropertyStore(scores, "corral_empty")
	const blueLowZoneBalloon = createSecondOrderPropertyStore(scores, "blue", "zone_balloons")
	const blueLowZoneBunny = createSecondOrderPropertyStore(scores, "blue", "zone_bunnies")
	const redLowZoneBalloon = createSecondOrderPropertyStore(scores, "red", "zone_balloons")
	const redLowZoneBunny = createSecondOrderPropertyStore(scores, "red", "zone_bunnies")
	const redFouls = createSecondOrderPropertyStore(scores, "red", "foul_points")
	const blueFouls = createSecondOrderPropertyStore(scores, "blue", "foul_points")
</script>

<main>
	<h1>Match Review - {$id}</h1>
	<div>
		<FieldCheckbox label="Is Corral Empty?" store={isCorralEmpty}></FieldCheckbox>
	</div>
	<div class="reviewcontainer">
		<div>
			<h2>Red Points - {$redScore}</h2>
		</div>
		<div>
			<h2>Blue Points - {$blueScore}</h2>
		</div>
	</div>
	<div class="reviewcontainer">
		<div>
			<h2>Red Low Zone</h2>
			<Field label="Balloons" store={redLowZoneBalloon}></Field>
				<Field label="Auto Bunnies" store={redLowZoneBunny}></Field>
		</div>
		<div>
			<h2>Blue Low Zone</h2>
			<Field label="Balloons" store={blueLowZoneBalloon}></Field>
			<Field label="Auto Bunnies" store={blueLowZoneBunny}></Field>
		</div>
	</div>

	<div class="reviewcontainer">
		<div>
			<h2>Fouls for Red</h2>
			<Field label="Foul Points" store={redFouls}></Field>
		</div>
		<div>
			<h2>Fouls for Blue</h2>
			<Field label="Foul Points" store={blueFouls}></Field>
		</div>
	</div>

	<div class="reviewcontainer">
		<div>
			<h2>Red Alliance Cards</h2>
			<div style="display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;margin-bottom: 30px;">
				<Card isRedAlliance={true} stationid={1}></Card>
				<Card isRedAlliance={true} stationid={2}></Card>
				<Card isRedAlliance={true} stationid={3}></Card>
			</div>
		</div>
		<div>
			<h2>Blue Alliance Cards</h2>
			<div style="display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;margin-bottom: 30px">
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

	:global(:root) {
		touch-action: pan-y;
		height: 100%;
	}

	:global(body) {
		margin: 0 !important;
		padding: 0;
	}
</style>
