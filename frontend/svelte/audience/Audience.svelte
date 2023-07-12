<script lang="ts">
	import { eventData } from "@store";
	import Match from "./components/Match.svelte";
	import Message from "./components/Message.svelte";
	import { crossfade, fade } from "svelte/transition";
	import { quintOut } from 'svelte/easing';

	let element = Message


	eventData.subscribe(({atLunch}) => {
		if (atLunch) {
			element = Message
		} else {
			element = Match
		}
	})

</script>

<div >
	<svelte:component  this={element}/>
</div>
