<script lang="ts">
	import type { TeamData } from "../../common/types";
	import {
		derived,
		writable,
		type Readable,
		type Writable,
	} from "svelte/store";
	import { teams } from "../store";
	import { PlayoffAlliance } from "../../common/alliances";
	import { backend_url } from "../../secrets";
  import { fade, fly, slide } from "svelte/transition";

	const alliances: Writable<TeamData[][]> = writable([]);
	function updateAlliances() {
		fetch(backend_url + "/api/alliances").then(async (data) => {
			$alliances = await data.json();
		});
	}
	updateAlliances()
	teams.subscribe((value) => {
		updateAlliances()
	})
	let sortedTeams: Readable<TeamData[]> = derived(teams, ($teams) =>
		$teams
			.filter((team) => team.playoffAlliance == PlayoffAlliance.NONE)
			.sort((a, b) => b.rankingPoints - a.rankingPoints)
	);
</script>

<div id="alliances">
	<h1>Alliances</h1>
	<div id="allianceGrid">
		{#each $alliances as alliance, i}
			<div class="alliance-box">
				<h2>Alliance {i + 1}</h2>
				<div class=alliance-teams>
				{#each alliance as team}
					<div transition:fade class="alliance-member">
						<p>{team.display_id}</p>
					</div>
				{/each}
			</div>
			</div>
		{/each}
	</div>
</div>

<div id="team-display">
	<h1>Available Teams</h1>
	<div id="teamGrid">
		{#each $sortedTeams as team, i}
			<div class="team-box" transition:slide|local>
				<p><strong>{i + 1})</strong> {team.display_id}</p>
			</div>
		{/each}
	</div>
</div>
<footer />

<style lang="scss">
	p {
		color: black;
	}
	#allianceGrid {
		display:grid;

		grid-template-columns: repeat(2, 50%);
		grid-template-rows: repeat(2, 40vh);
		.alliance-box {
			background-color:#f7dc99;
			padding:10px;
			margin:20px;
			border-radius: 10px;
			display:flex;
			flex-direction: column;
		}
		.alliance-member {
			text-align: center;
			position:relative;
			p {
				margin:0;
				position:absolute;
				top:50%;
				left:50%;
				transform: translate(-50%, -50%);
				font-size:40px;
			}
		}
		P {
			font-size:25px;
		}
		h2 {
			font-size:50px;
		}
		
	}
	.alliance-teams {
		flex: 1;
		display:grid;
		grid-template-rows:auto auto;
		grid-template-columns: auto auto;
	}
	#teamGrid {
		display: grid;
		grid-template-columns: repeat(3, auto);
		grid-template-rows: repeat(8, auto);
		grid-auto-flow: column;
	}
	.team-box {
		display: block;
		border-radius: 25px;
		text-align: left;
		padding-left: 20px;
		font-size: 50px;
		p {
			line-height: 100%;
			margin: 2.6vh;
		}
		strong {
			font-weight: 900;
		}
	}

	
	#team-display {
		position: absolute;
		left: 51vw;
		right: 1vw;
		top: 1vw;
		bottom: 1vw;
		text-justify: auto;
		background-color: #f7dc99;
		justify-content: center;
		border-radius: 25px;
		align-items: center;
	}

	#alliances {
		position: absolute;
		left: 1vw;
		right: 51vw;
		top: 1vw;
		bottom: 1vw;
		background-color: #eea19c;
		border-radius: 20px;

	}
	h2 {
		color: black;
	}

	h1 {
		color: black;
	}
</style>
