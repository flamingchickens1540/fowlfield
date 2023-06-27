<script lang="ts">
	// import Teams from "./components/teams/Teams.svelte";
	
	
	import { MatchState, type MatchData, type TeamData } from "@fowltypes";
	import matchData, { abortMatch, commitMatch, matchList, remainingTimeInPeriod, setPreloadingTrack, startMatch, loadedMatches, teamList } from "@store";
	import { derived, writable, type Readable, get, type Writable, type Unsubscriber } from "svelte/store";
	
	import { formatDuration } from "@fowlutils/format";
	import socket from "@socket";
	import TeamDatalistEntry from "./components/TeamDatalistEntry.svelte";
	import type { WritableTeamData } from "socketStore";
	import writableDerived from "svelte-writable-derived"
	setPreloadingTrack(true)
	
	const {loaded:loadedMatch, preloaded:preloadedMatch }= loadedMatches
	const statusColors:{[key in MatchState]:string} = {
		[MatchState.PENDING]:     "#dc0000",
		[MatchState.IN_PROGRESS]: "#baba02",
		[MatchState.COMPLETE]: 	  "#0000ff",
		[MatchState.POSTED]:      "#009f22",
	}
	
	const statusMessages:{[key in MatchState]:string} = {
		[MatchState.PENDING]: 		"Pending",
		[MatchState.IN_PROGRESS]: 	"In Progress",
		[MatchState.COMPLETE]: 		"Complete",
		[MatchState.POSTED]:   		"Posted",
	}
	
	const buttonData:{[key in MatchState]:{text:string, color:string}} = {
		[MatchState.PENDING]: 		{text:"Start", color:"#02ae02"},
		[MatchState.IN_PROGRESS]: 	{text:"Abort", color:"#b30000"},
		[MatchState.COMPLETE]: 		{text:"Commit and Show", color:"#0000b8"},
		[MatchState.POSTED]:   		{text:"Recommit", color:"#000000"},
	}
	
	function getColorValue(color:string, alpha:number) {
		return color+(alpha*255).toString(16)
	}
	
	function transitionLoadState() {
		if ($preloadedMatch !=$matchid) {
			socket.emit("preloadMatch", $matchid)
		} else {
			socket.emit("preloadMatch", $matchid)
			socket.emit("loadMatch", $matchid)
		}
	}
	
	function transitionMatchState() {
		switch ($matchstate) {
			case MatchState.PENDING: startMatch();break;
			case MatchState.IN_PROGRESS:abortMatch();break;
			case MatchState.COMPLETE:commitMatch();break
			case MatchState.POSTED:commitMatch();break
		}
	}
	
	function getMatchData(id) {
		if ($loadedMatch == id) 	return {text:"Reload", buttoncolor:"#840082", itemstyle: "background-color:#680066"}
		if ($preloadedMatch == id) 	return {text:"Load", buttoncolor:"#b400b1", itemstyle: "background-color:#683900"}
		return {text:"Preload", buttoncolor:"#a56600", itemstyle: ""}
	}
	
	const matchLoadState = writable({text:"Preload", buttoncolor:"#a56600", itemstyle: ""})
	$: $matchLoadState, console.log("STATE", $matchLoadState)
	$: $loadedMatch, $matchLoadState = getMatchData($matchid)
	$: $preloadedMatch, $matchLoadState = getMatchData($matchid)
	
	function setTeam(value:string, position:`${"red"|"blue"}${"1"|"2"|"3"}`) {
		const team = Object.values($teamList).find((team) => team.displaynum.get() == value)
		console.log(team, value, position)
		if (team != null) {
			matchData[position].set(team.id)
		}
	}
	function getTeamDerived(store:Writable<number>) {
		return writableDerived(store, 
		(storevalue) => {
			return $teamList[storevalue]?.displaynum.get()
		}, 
		(value, storevalue) => {
			console.log(value)
			if (value == "") {return null}
			const team:WritableTeamData = Object.values($teamList).find((team) => team.displaynum.get() == value)
			if (team != null) {return team.id}

			return storevalue;
		})
	}
	let teamRed1;
	let teamRed2;
	let teamRed3;
	let teamBlue1;
	let teamBlue2;
	let teamBlue3;
	let teamlistunsub:Unsubscriber;
	teamlistunsub = teamList.subscribe((value) => {
		if (Object.values(value).length > 0) {
			teamRed1 = getTeamDerived(matchData.red1)
			teamRed2 = getTeamDerived(matchData.red2)
			teamRed3 = getTeamDerived(matchData.red3)
			teamBlue1 = getTeamDerived(matchData.blue1)
			teamBlue2 = getTeamDerived(matchData.blue2)
			teamBlue3 = getTeamDerived(matchData.blue3)
			teamlistunsub()
		}
	})
	const matchid = matchData.id
	const matchstate = derived(matchData.state, ($state) => $state ?? MatchState.PENDING)
	const matches:Readable<MatchData[]> = derived(matchList, Object.values)
</script>

<datalist id="teams">
	{#each Object.values($teamList) as team}
	<TeamDatalistEntry {team}></TeamDatalistEntry>
	{/each}
</datalist>

<main>
	<div id="header">
		<p>Bunnybots Scoreboard</p>
	</div>
	<h2>Scoring</h2>
	<div class="sidebar-l">
		<h2>Matches</h2>
		<div id=matchGrid>
			{#each $matches as match,i}
			<div class="matchEntry" style="{getMatchData(match.id).itemstyle}">
				<span>{match.id}</span>
				<button disabled={match.id == $matchid} class="loadButton" on:click={() => $matchid = match.id}>Open</button>
				<div class="statustext" style="background-color:{statusColors[match.state]}">{statusMessages[match.state]}</div>
			</div>
			{/each}
			
		</div>
	</div>
	<div class="sidebar-r">
		<h2>Match {($matchid ?? "HELP")}</h2>
		<div class=row>
			<button on:click={transitionLoadState} class=match-control style="background-color:{$matchLoadState.buttoncolor};">{$matchLoadState.text}</button>
			<button on:click={transitionMatchState} class=match-control style="background-color:{buttonData[$matchstate].color};">{buttonData[$matchstate].text}</button>
		</div>
		<h3 id=match-time>{$matchstate != MatchState.IN_PROGRESS ? statusMessages[$matchstate]: formatDuration($remainingTimeInPeriod)}</h3>
		<div id="control-buttons">
			<!-- <AudienceControl screen={{layout:AudienceScreenLayout.BLANK, match:$matchID}} text="Show Blank"></AudienceControl><br>
				<AudienceControl screen={{layout:AudienceScreenLayout.MATCH, match:$matchID}} text="Show Match Screen"></AudienceControl><br>
				<AudienceControl screen={{layout:AudienceScreenLayout.SCORES, match:$matchID}} text="Show Scores"></AudienceControl><br>
				<AudienceControl screen={{layout:AudienceScreenLayout.WIN, match:$matchID}} text="Show Win Screen"></AudienceControl> -->
			</div>
			<p id="teams-header">Teams</p>
			<div id=teamsgrid>
				<div class=row>
					<div class=item>Red</div>
					<div class=item>Blue</div>
				</div>
				<div class=row>
					<div class=item><input bind:value={$teamRed1} list=teams/></div>
					<div class=item><input bind:value={$teamBlue1} list=teams/></div>
				</div>
				<div class=row>
					<div class=item><input bind:value={$teamRed2} list=teams/></div>
					<div class=item><input bind:value={$teamBlue2} list=teams/></div>
				</div>
				<div class=row>
					<div class=item><input  bind:value={$teamRed3} list=teams/></div>
					<div class=item><input  bind:value={$teamBlue3} list=teams/></div>
				</div>
				
			</div>
			<br>
			<br>
			
			<!-- <Teams/> -->
		</div>
	</main>
	
	<style lang="scss">
		#teamsgrid {
			margin-left:auto;
			margin-right:auto;
			display:grid;
			grid-template-columns: auto auto;
			grid-auto-flow: row;
			width:100%;
			.row:first-child {
				:first-child {border-top-left-radius: 5px;}
				:last-child {border-top-right-radius: 5px;}
			}
			.row:last-child {
				> * {padding-bottom:5px;}
				input {
					border-radius: 0px !important;
				}
				:first-child {border-bottom-left-radius: 5px;}
				:last-child {border-bottom-right-radius: 5px;}
			}
			.row {
				display:contents;
				.item {
					input {
						width:80%;
						border:0px;
						height:20px;
						padding:3px 5px;
						margin:5px;
					}
					border:none;
					&:first-child {
						
						background-color: var(--red);
					}
					&:last-child {
						background-color: var(--blue);
					}
				}
			}
		}
		
		
		.sidebar-l {
			padding:10px;
		}
		#matchGrid {
			display:flex;
			flex-flow: column nowrap;
			overflow-y: scroll;
			max-height:70vh;
			.matchEntry:first-child {
				border-top-left-radius:15px;
				border-top-right-radius:15px;
			}
			.matchEntry:last-child {
				border-bottom-left-radius:15px;
				border-bottom-right-radius:15px;
			}
			padding-right:0;
			width:100%;
		}
		.matchEntry {
			background-color: rgba(100,100,100,0.5);
			&:nth-child(odd) {
				background-color: rgba(100,100,100,0.3);
			}
			box-sizing: border-box;
			display:flex;
			flex-flow:row nowrap;
			justify-content:space-between;
			
			width:300px;
			padding:10px 10px;
			align-items: center;
			
			& > * {
				margin-left: 5px;
				margin-right: 5px;
			}
			
			.statustext {
				padding:0.1em 0.2em;
				width:100px;
				border-radius: 7px;
				font-weight:700;
			}
			
			span {
				flex-grow: 2;
				font-size:20px;
			}
			
			button {
				padding: 0.2em 0.7em;
				background-color: #1a1a1af0;
			}
		}
		.row {
			display:grid;
			grid-auto-flow: row;
			
		}
		#header {
			left: 0px;
			right: 0px;
			text-align: center;
			padding: 10px;
		}
		#new-match {
			margin-top:20px;
			width:100%
		}
		
		// input {
			// 	width: 20px;
			// }
		</style>
		