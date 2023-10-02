
<script lang=ts>
	import { teamList } from "@store";
	import { derived } from "svelte/store";
	const alliances = derived(teamList, ($teamList) => {
		const list = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
		Object.values($teamList).forEach((team) => {
			if (team.alliance.get() == 0 || team.alliancePosition.get() == 0) {return}
			list[team.alliance.get()-1][team.alliancePosition.get()-1] = team.id
		})
		return list
	})
</script>


<div id=alliance-display>
	
</div>