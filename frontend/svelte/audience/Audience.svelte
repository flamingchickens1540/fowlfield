

<script lang="ts">
	import matchData, { eventData } from "@store";
	import Match from "./components/Match.svelte";
	import Message from "./components/Message.svelte";
	import Results from "./components/QualsResults.svelte";
	import PlayoffResults from "./components/PlayoffResults.svelte";
	import { derived } from "svelte/store";
	const {type} = matchData;
	const shown = derived([matchData.type, eventData], ([$type, { atLunch }]) => {
		if (atLunch) {
			return "msg"
		} else {
			// TODO: Fix this
			return $type == "elimination" ? "playoffResults" : "results"
		}
	});
</script>


<div style="display:{$shown === 'msg' ? 'contents': 'none'}">
	<Message></Message>
</div>

<div style="display:{$shown === 'results' ? 'contents': 'none'}">
	<Results></Results>
</div>

<div style="display:{$shown === 'playoffResults' ? 'contents': 'none'}">
	<PlayoffResults></PlayoffResults>
</div>

<div style="display:{$shown === 'match' ? 'contents': 'none'}">
	<Match></Match>
</div>
