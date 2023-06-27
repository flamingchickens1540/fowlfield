<script lang="ts">
	import type { TeamData } from "@fowltypes";
	import socket from "@socket";
	import type { WritableTeamData } from "socketStore";
	import { writable, type Writable } from "svelte/store";
	export let team: WritableTeamData;
	const {id, displaynum, name, alliance, robotname} = team
	const alliancestring:Writable<string> = writable($alliance?.toString() ?? "0")

	let nobodymove:boolean = false
	alliance.subscribe((value) => {
		if (nobodymove) {return}
		nobodymove = true;
		alliancestring.set((value ?? 0).toString())
		nobodymove = false;
	})
	alliancestring.subscribe((value) => {
		if (nobodymove) {return}
		nobodymove = true;
		alliance.set((parseInt(value) ?? 0) as 0|1|2|3|4)
		nobodymove = false;
	})
</script>

<div class=tablerow>
	
	<div class="tableitem darken">{id}</div>	
	<input class="tableitem centertext" type="string" bind:value={$displaynum} />
	<input class="tableitem" type="string" bind:value={$name} />
	<input class="tableitem" type="string" bind:value={$robotname} />
	<select class="tableitem" bind:value={$alliancestring}>
		<option value=0>None</option>
		<option value=1>Alliance 1</option>
		<option value=2>Alliance 2</option>
		<option value=3>Alliance 3</option>
		<option value=4>Alliance 4</option>
	</select>
	<button class="tableitem" on:click={() => socket.emit("deleteTeam", id)}>-</button>
</div>

<style lang="scss">
	@import "../event.scss";
	button {
		background-color: rgb(141, 0, 0) !important;
	}
	
</style>
