<script lang="ts">
	import type {DriverStation} from "~common/types";
	import socket from "~/lib/socket";
	import matchData, {dsStatuses, teamList} from "~/lib/store";
	import {derived} from "svelte/store";

	export let pos: `${"red" | "blue"}${1 | 2 | 3}`;

	const map: { [key in typeof pos]: DriverStation } = {
		red1: "R1",
		red2: "R2",
		red3: "R3",
		blue1: "B1",
		blue2: "B2",
		blue3: "B3",
	};

	const store = derived([matchData[pos], teamList], ([$teamid, $teams]) => $teams[$teamid]?.displaynum?.get() ?? "0");
	const backgroundColor = derived(dsStatuses, ($statuses) => (($statuses ?? {})[map[pos]]?.isEstopped ? "background-color:#000000c5" : ""));
	const onclick = () => {
		socket.emit("estop", map[pos]);
	};

	let element: HTMLDivElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={onclick} bind:this={element} style={$backgroundColor} class="noselect estop-button">
	{$store}
</div>

<style>
	.estop-button {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20vh;

		&.pressed {
			background-color: #000000c5;
		}
	}

	.noselect {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
	}
</style>
