<script lang="ts">
	import socket from "~//lib/socket";
	import type { SocketWritableOf } from '~/lib/socketStore'
	import type { Team } from '@prisma/client'
	import writableDerived from 'svelte-writable-derived'

	export let team: SocketWritableOf<Team>;
	const {id, display_number, team_name, robot_name, has_card} = team
	display_number.setWritable()
	team_name.setWritable()
	robot_name.setWritable()
	has_card.setWritable()
</script>

<div class=tablerow>	
	<div class="tableitem darken">{$id}</div>
	<input class="tableitem centertext" type="text" bind:value={$display_number} />
	<input class="tableitem" type="text" bind:value={$team_name} />
	<input class="tableitem" type="text" bind:value={$robot_name} />
	<input class="tableitem" type="checkbox" style="background-color:{$has_card ? '#6c6c00' : '#383838'}" bind:value={$has_card} />
	<button class="tableitem" on:click={() => socket.emit("deleteTeam", $id)}>-</button>
</div>

<style lang="scss">
	@import "../event";
	button {
		background-color: rgb(141, 0, 0) !important;
	}
</style>
