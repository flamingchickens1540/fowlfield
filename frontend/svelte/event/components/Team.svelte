<script lang="ts">
	import {Card} from "@fowltypes";
	import socket from "@socket";
	import type {WritableTeamData} from "socketStore";
	import writableDerived from "svelte-writable-derived";
	import {type Writable} from "svelte/store";

	export let team: WritableTeamData;
	const {id, displaynum, name, alliance, robotname, alliancePosition, card} = team
	const alliancestring:Writable<string> = writableDerived(alliance, (currentalliance) => currentalliance?.toString() ?? "0", (value) => (parseInt(value) ?? 0) as 0|1|2|3|4)
	const allianceposstring:Writable<string> = writableDerived(alliancePosition, (current) => current?.toString() ?? "0", (value) => (parseInt(value) ?? 0) as 0|1|2|3|4)

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
	<select class="tableitem" bind:value={$allianceposstring}>
		<option value=0>None</option>
		<option value=1>Captain</option>
		<option value=2>Pick 1</option>
		<option value=3>Pick 2</option>
		<option value=4>Pick 3</option>
	</select>
	<select class="tableitem" style="background-color:{$card == Card.RED ? '#800000' : $card == Card.YELLOW ? '#6c6c00' : '#383838'}" bind:value={$card}>
		<option value={Card.RED}>Red Card</option>
		<option value={Card.YELLOW}>Yellow Card</option>
		<option value={Card.NONE}>None</option>
	</select>
	<button class="tableitem" on:click={() => socket.emit("deleteTeam", id)}>-</button>
</div>

<style lang="scss">
	@import "../event.scss";
	button {
		background-color: rgb(141, 0, 0) !important;
	}
	
</style>
