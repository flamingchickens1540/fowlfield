<script lang="ts">
	import { matchList, rankings } from '~/lib/store'
	import { onMount } from 'svelte'
	import { derived, type Readable } from 'svelte/store'
	import TeamRanking from './components/TeamRanking.svelte'


	const lastUpdated:Readable<string> = derived(matchList, ($matches) => {
		let mostRecent = {id:"never",time:0};
		
		for (let match of Object.values($matches)) {
			if (match.state == "posted" && (match.startTime ?? 0) > mostRecent.time) {
				mostRecent.id = match.id;
				mostRecent.time = match.startTime!
			}
		}
		return mostRecent.id
	})
	onMount(() => {
		let isGoingDown = true;
		let lastTime = 0
		const scroll = ((time:number) => {
			if (isHovering) {
				lastTime = time
				requestAnimationFrame(scroll);
				return
			}
			const distanceToBottom = document.body.scrollHeight - (window.scrollY + window.innerHeight)
			const distanceToTop = window.scrollY

			if (isGoingDown) {
				window.scrollBy(0, (time-lastTime)*0.1)
				if (distanceToBottom < 1) {
					setTimeout(() => isGoingDown = false, 3000)
				}
			} else {
				window.scrollBy(0, -3*(time-lastTime))

				if (distanceToTop < 1) {
					setTimeout(() => isGoingDown = true, 3000)
				}
			}
			lastTime = time
			requestAnimationFrame(scroll)
		})
		scroll(0)
	})
	let isHovering:boolean = false
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
			<tbody id="tablebody" on:mouseenter={() => isHovering = true} on:mouseleave={() => isHovering = false}>
				{#each $rankings as ranking, i}
					<TeamRanking {ranking} rank={i+1} />
				{/each}
				<tr id=bottom></tr>
			</tbody>
		</table>
	
	<div class="footer">Last updated after {$lastUpdated}</div>
</div>

<style lang="scss">
	@import "rankings";
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
		box-shadow: 0 15px 20px 20px hsl(0, 0%, 15%);
		position: sticky;
		z-index: 10;
		bottom: 0;
		background-color: hsl(50, 0%, 40%);
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
		font-family: arial,sans-serif;
		
		border-collapse: collapse;
		border-spacing: 0;
	}
</style>
