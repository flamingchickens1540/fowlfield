<script lang="ts">
	import { derived, type Readable } from "svelte/store";
	import { matchList, teamList } from "../store";
	import type { WritableTeamData } from "socketStore";
	import TeamRanking from "./components/TeamRanking.svelte";
	import { MatchState } from "../../../common/types/types";

	let teamsSorted: Readable<WritableTeamData[]> = derived(teamList, ($teams) =>
		(Object.values($teams) ?? []).sort(
			(a, b) => b.matchStats.get().rp - a.matchStats.get().rp
		)
	);

	let lastUpdated:Readable<string> = derived(matchList, ($matches) => {
		let mostRecent = {id:"never",time:0};

		for (let match of Object.values($matches)) {
			if (match.state == MatchState.POSTED && match.startTime > mostRecent.time) {
				mostRecent.id = match.id;
				mostRecent.time = match.startTime
			}
		}
		return mostRecent.id
	})
	// onMount(() => {
	// 	const scrollElement = jQuery(".tableContainer");
	// 	function anim() {
	// 		var sb = scrollElement.prop("scrollHeight") - scrollElement.innerHeight();
	// 		scrollElement.animate({ scrollTop:  sb }, $teamsSorted.length*750, () => {
	// 			scrollElement.animate({ scrollTop: 0 }, 500, anim);
	// 		});
	// 	}
	// 	function stop() {
	// 		scrollElement.stop();
	// 	}
	// 	anim();
	// 	scrollElement.hover(stop, anim);
	// });
</script>

<div class="container">
	<table>
		<thead>
			<tr>
				<th>Rank</th>
				<th>Team Number</th>
				<th>Team Name</th>
				<th>RP</th>
				<th>W-L-T</th>
			</tr>
		</thead>
		<tbody id="tablebody">
			{#each $teamsSorted as team, i}
				<TeamRanking rank={i + 1} teamData={team} />
			{/each}
		</tbody>
	</table>

	<div class="footer">Last updated after {$lastUpdated}</div>
</div>

<style lang="scss">
	@import "./rankings.scss";
	.container {
		display: grid;
		grid-template-rows: auto 25px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
	}
	.footer {
		height: 100%;
		box-shadow: 0px 15px 20px 20px hsl(34, 57%, 15%);
		position: sticky;
		z-index: 10;
		bottom: 0;
		background-color: hsl(34, 57%, 40%);
	}
	:global(:root) {
		overscroll-behavior: none;
	}

	:global(body) {
		margin: 0;
		&::-webkit-scrollbar {
			display: none;
		}
		scroll-behavior: none;
	}

	table {
		font-family: arial;

		border-collapse: collapse;
		border-spacing: 0;
	}
</style>
