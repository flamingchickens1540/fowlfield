<script lang="ts">
	import { derived, type Readable } from "svelte/store";
	import { matchList, teamList } from "../store";
	import type { WritableTeamData } from "socketStore";
	import TeamRanking from "./components/TeamRanking.svelte";
	import { MatchState } from "../../../common/types/types";
	import { onMount } from "svelte";
	
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
	onMount(() => {
		let isGoingDown = true;
		setInterval(() => {
			const distanceToBottom = document.body.scrollHeight-(window.scrollY + window.innerHeight)
			const distanceToTop = window.scrollY
			if (isGoingDown) {
				window.scrollBy(0, 1)
				if (distanceToBottom == 0) {
					setTimeout(() => isGoingDown = false, 3000)
				};

			} else {
				window.scrollBy(0, -30)

				if (distanceToTop == 0) {
					setTimeout(() => isGoingDown = true, 3000)
				};
			}
		}, 20)
	});
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
				<tr id=bottom></tr>
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
	}
	
	table {
		font-family: arial;
		
		border-collapse: collapse;
		border-spacing: 0;
	}
</style>
