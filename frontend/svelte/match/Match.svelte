<script lang="ts">
	// import Teams from "./components/teams/Teams.svelte";
	
	import { MatchState, type MatchData } from "@fowltypes";
	import matchData, { abortMatch, commitMatch, dsStatuses, loadedMatches, matchList, remainingTimeInPeriod, setPreloadingTrack, startMatch, teamList } from "@store";
	import { onMount } from "svelte";
	import { derived, get, writable, type Readable, type Unsubscriber, type Writable } from "svelte/store";
	
	import { formatDuration } from "@fowlutils/format";
	import socket from "@socket";
	import configureAudio from "audio";
	import { statusColors, statusMessages } from "consts";
	
	import TeamDatalistEntry from "./components/TeamDatalistEntry.svelte";
	import TeamEntry from "./components/TeamEntry.svelte";
	
	import Sortable, { Swap } from 'sortablejs';
	import AllianceStationMonitor from "./components/AllianceStationMonitor.svelte";
	import AllianceStationMonitorParent from "./components/AllianceStationMonitorParent.svelte";
	
	Sortable.mount(new Swap())
	
	setPreloadingTrack(true)
	
	configureAudio()
	
	const {loaded:loadedMatch, preloaded:preloadedMatch }= loadedMatches
	
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
		if ($preloadedMatch != $matchid) {
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
	

	
	let showTeams = false
	let teamlistunsub:Unsubscriber;
	const {red1, red2, red3, blue1, blue2, blue3, redAlliance, blueAlliance} = matchData
	teamlistunsub = teamList.subscribe((value) => {
		if (Object.values(value).length > 0) {
			showTeams = true
			teamlistunsub()
		}
	})
	const matchid = matchData.id
	const matchstate = derived(matchData.state, ($state) => $state ?? MatchState.PENDING)
	const matches:Readable<MatchData[]> = derived(matchList, Object.values)
	
	let redTeamParent:HTMLElement;
	let blueTeamParent:HTMLElement;
	
	let setSortingEnabled:(enabled:boolean)=>void
	

	
		$: hasAdjustedSort = (
				$red1  != $dsStatuses?.R1?.assignedTeam ||
				$red2  != $dsStatuses?.R2?.assignedTeam ||
				$red3  != $dsStatuses?.R3?.assignedTeam ||
				$blue1 != $dsStatuses?.B1?.assignedTeam ||
				$blue2 != $dsStatuses?.B2?.assignedTeam ||
				$blue3 != $dsStatuses?.B3?.assignedTeam
			) && $loadedMatch == $matchid
	
	onMount(() => {
		function onEnd(event:Sortable.SortableEvent) {
			const teamA = event.from.children[event.oldIndex].id.replace(/^team-/, "")
			const teamB = event.item.id.replace(/^team-/, "")
			const storeA:Writable<number> = matchData[teamA]
			const storeB:Writable<number> = matchData[teamB]
			const teamAId = get(storeA)
			storeA.set(get(storeB))
			storeB.set(teamAId)
		}
		const redSortable = new Sortable(redTeamParent, {
			draggable:".item",
			group:"teams",
			swap:true,
			onEnd
		})
		
		const blueSortable = new Sortable(blueTeamParent, {
			draggable:".item",
			group:"teams",
			swap:true,
			onEnd
		})
		setSortingEnabled = (enabled) =>{
			redSortable.option("sort", enabled)
			redSortable.option("group", {
				name:"teams",
				pull:enabled,
				put:enabled
			})
			blueSortable.option("sort", enabled)
			blueSortable.option("group", {
				name:"teams",
				pull:enabled,
				put:enabled
			})
			$isSortingEnabled = enabled
		}

		matchstate.subscribe(() => setSortingEnabled($matchstate == MatchState.PENDING))
	})

	let isSortingEnabled = writable(true)
	
	
</script>

<datalist id="teams">
	{#each Object.values($teamList) as team}
	<TeamDatalistEntry {team}></TeamDatalistEntry>
	{/each}
</datalist>

<main>
	<div id="scoring">
		<h2>Scoring</h2>
	</div>
	<div id="monitor">
		<AllianceStationMonitorParent />
		<AllianceStationMonitor station="R1"></AllianceStationMonitor>
		<AllianceStationMonitor station="R2"></AllianceStationMonitor>
		<AllianceStationMonitor station="R3"></AllianceStationMonitor>
		<AllianceStationMonitor station="B1"></AllianceStationMonitor>
		<AllianceStationMonitor station="B2"></AllianceStationMonitor>
		<AllianceStationMonitor station="B3"></AllianceStationMonitor>
	</div>
	
	<div id="sidebar-l">
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
		<button on:click={() => socket.emit("nextMatch", "qualification")}>Next Quals</button>
		<button on:click={() => socket.emit("nextMatch", "elimination")}>Next Elims</button>
	</div>
	<div id="sidebar-r">
		<h2>Match {($matchid ?? "HELP")}</h2>
		<div class=row>
			<button on:click={transitionLoadState} class=match-control style="background-color:{$matchLoadState.buttoncolor};">{$matchLoadState.text}</button>
			<button on:click={transitionMatchState} class=match-control style="background-color:{buttonData[$matchstate].color};">{buttonData[$matchstate].text}</button>
		</div>
		<h3 id=match-time>{$matchstate != MatchState.IN_PROGRESS ? statusMessages[$matchstate]: formatDuration($remainingTimeInPeriod)}</h3>
			<p id="teams-header">Teams</p>
			<div id=teamsgrid>
				{#if $redAlliance == 0}
				<div class=row>
					<div class="item item-1-1">Red</div>
					<div class="item item-2-1">Blue</div>
				</div>
				{:else}
				<div class=row>
					<div class="item item-1-1">Red ({$redAlliance})</div>
					<div class="item item-2-1">Blue ({$blueAlliance})</div>
				</div>
				{/if}
				
				<div class=col data-alliance="red" bind:this={redTeamParent}>
					{#if showTeams}
					<div id=team-red1 class='item item-1-2'><TeamEntry store={red1} station=R1></TeamEntry></div>
					<div id=team-red2 class='item item-1-3'><TeamEntry store={red2} station=R2></TeamEntry></div>
					<div id=team-red3 class='item item-1-4'><TeamEntry store={red3} station=R3></TeamEntry></div>
					{/if}
				</div>
				<div class=col data-alliance="blue" bind:this={blueTeamParent}>
					{#if showTeams}
					<div id=team-blue1 class="item item-2-2"><TeamEntry store={blue1} station=B1></TeamEntry></div>
					<div id=team-blue2 class="item item-2-3"><TeamEntry store={blue2} station=B2></TeamEntry></div>
					<div id=team-blue3 class="item item-2-4"><TeamEntry store={blue3} station=B3></TeamEntry></div>
					{/if}
				</div>
				{#if !hasAdjustedSort}
				<button class=item id=sorting-toggle on:click={() => setSortingEnabled(!$isSortingEnabled)}><span id=lock-icon class="material-symbols-outlined">{$isSortingEnabled?"lock_open_right":"lock"}</span></button>
				{:else} 
				<button on:click={transitionLoadState} class=item id=sorting-toggle style="background-color:#c3b40bbc;">Update FMS</button>
				{/if}
			</div>
		</div>
	</main>
	
	<style lang="scss">
		#lock-icon {
			width:24px;

			text-align:center;
			overflow:hidden;
		}
		@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
		#monitor {
			display:grid;
			grid-template-rows: repeat(7, calc(100%/7));
			grid-template-columns: repeat(7, calc(100%/7));
			column-gap:1px;
		}
		main {
			position:absolute;
			left:0;
			right:0;
			top:0;
			bottom:0;
			display:grid;
			grid-template-columns: 
			[left] 340px
			[center] auto
			[right] 320px;
			grid-template-rows:
			[top] 50%
			[bottom] 50%;
		}
		:global(body) {
			margin:0;
			overscroll-behavior: none;
		}
		#teamsgrid {
			margin-left:auto;
			margin-right:auto;
			display:grid;
			grid-template-columns: auto auto;
			grid-auto-flow: row;
			width:100%;
			
			.col, .row {
				display:contents;
				&:nth-child(1) {
					.item {
						border:none;
					}
				}

				&:last-child {
					&> * {padding-bottom:5px;}
					.item {
						border:none;
						
					}
				}
			}
		}
		
		#sorting-toggle{
			grid-column:1/span 2;
			margin:0;
			border-radius: 0;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
			background-color: rgb(99, 99, 99);
		}
		#matchGrid {
			display:flex;
			flex-flow: column nowrap;
			overflow-y: scroll;
			.matchEntry:first-child {
				border-top-left-radius:15px;
				border-top-right-radius:15px;
			}
			.matchEntry:last-child {
				border-bottom-left-radius:15px;
				border-bottom-right-radius:15px;
			}
			padding-right:0;
			max-height:82vh;
			width:320px;
			// &::-webkit-scrollbar {display: none;}
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
		
		#sidebar-l {
			grid-column: 1;
			grid-row: 1/span 2;
			background-color: #303030;
			padding:10px;
		}
		#sidebar-r {
			grid-column: 3;
			grid-row: 1/span 2;
			background-color: #303030;
			padding:40px;
			display: flex;
			flex-flow: column nowrap;
			justify-content:flex-start;
		}

		.item-1-1 {border-top-left-radius: 5px;}
		.item-2-1 {border-top-right-radius: 5px;}
		@mixin team-grid-position {
			@for $col from 1 through 2 {
				@for $row from 1 through 4 {
					.item-#{$col}-#{$row} { 
						grid-column: $col; 
						grid-row:$row; 
						@if $col == 1 {
							background-color: var(--red);
						} @else {
							background-color: var(--blue);
						}
					}
				}
			}
		}

		@include team-grid-position()

		
		// input {
			// 	width: 20px;
			// }
		</style>
		