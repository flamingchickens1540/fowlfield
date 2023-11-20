<script lang="ts">
	import { eventData } from "@store";
	import Match from "./components/Match.svelte";
	import Message from "./components/Message.svelte";

	let shown = "match";

	eventData.subscribe(({ atLunch }) => {
		if (atLunch) {
			shown = "msg"
		} else {
			shown = "match"
		}
	});
</script>


<div style="display:{shown == "msg" ? "contents": "none"}">
	<Message></Message>
</div>

<div style="display:{shown == "match" ? "contents": "none"}">
	<Match></Match>
</div>
