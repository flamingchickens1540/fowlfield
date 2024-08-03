<script lang=ts context=module>
	import {teamList} from "~/lib/store";
	import {derived} from "svelte/store";

	export const alliances = derived(teamList, ($teamList) => {
		const list = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
		Object.values($teamList).forEach((team) => {
			if (team.alliance.get() == 0 || team.alliancePosition.get() == 0) {return}
			list[team.alliance.get()-1][team.alliancePosition.get()-1] = team.id
		})
		return list
	})
</script>

<script lang=ts>
	import AllianceItem from "./components/AllianceItem.svelte";
	import socket from "~//lib/socket";
	import { onMount } from "svelte";

	let tbabutton:HTMLButtonElement;
	
	onMount(() => {
		alliances.subscribe(() => tbabutton.disabled = false)
		tbabutton.addEventListener("click", () => {
			socket.emit("commitAlliances", (success) => {
				tbabutton.disabled = success;
			})
		})
	})
</script>

<datalist id="teams">
	{#each Object.values($teamList) as team}
		{#if team.alliance.get() === 0}
			<option value={team.displaynum.get()}></option>
		{/if}
	{/each}
</datalist>

<h1>Alliance Selection</h1>
<div id=alliance-display>
	<div id=header>
		<div>Alliance</div>
		<div>Captain</div>
		<div>1st Pick</div>
		<div>2nd Pick</div>
		<div>3rd Pick</div>
	</div>
	<AllianceItem index={0}></AllianceItem>
	<AllianceItem index={1}></AllianceItem>
	<AllianceItem index={2}></AllianceItem>
	<AllianceItem index={3}></AllianceItem>
</div>

<button bind:this={tbabutton}>Publish to TBA</button>

<style lang=scss>
	button {
		margin-top:80px;
		background-color:#4555a5;
		margin-bottom:20px;
		font-size:30px;
		padding:20px;
	}
	#alliance-display {
		display:grid;
		grid-auto-flow: row;
		grid-template-columns: 200px auto auto auto auto;
		grid-gap: 1em;
		#header {
			display:contents; 
			font-size:30px;
			> * {
				margin-top:20px;
				margin-bottom:20px;
			}
		}
	}
</style>