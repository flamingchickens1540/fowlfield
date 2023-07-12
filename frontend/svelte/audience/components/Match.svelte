<script lang="ts">
	import { MatchPeriod } from "@fowltypes";
	import { formatDuration } from "@fowlutils/format";
	import matchData, {remainingTimeInDisplayPeriod, matchPeriod, teamList} from "@store";
	import { fade } from "svelte/transition";
	import { derived } from "svelte/store";


  
  const {red1, red2, red3, blue1, blue2, blue3, redAlliance, blueAlliance, redScore, blueScore, matchNumber, type} = matchData
  

	const scoreHeight = derived(type, ($type) => $type == "qualification" ? "1946px": "1978px");
	const allianceDisplay = derived(type, ($type) => $type == "qualification" ? "none": "block");

	const teamNumberMap = {}

	$: {
		Object.values($teamList).forEach((team) => {teamNumberMap[team.id] = team.displaynum.get()})
	}

	const icons:{[key in MatchPeriod]:string} = {
		[MatchPeriod.PREMATCH]: "hourglass_top",
		[MatchPeriod.AUTO]: "smart_toy",
		[MatchPeriod.PAUSE]: "",
		[MatchPeriod.TELEOP]: "sports_esports",
		[MatchPeriod.POSTMATCH]: "hourglass_bottom"
	}
</script>

<style lang=scss>
	@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
	@import url('https://fonts.googleapis.com/css2?family=Monomaniac+One&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
	@import "./matchstyle.scss";

	.match {
		background-color: #0f0;
	}
	
</style>

<div class=match out:fade={{}} in:fade={{}}>
	<div class="rectangle-info"></div>
	
	<div class="rectangle-red"></div>
	
	<div class="rectangle-blue"></div>
	
	<div class="team-blue-1">{teamNumberMap[$blue1] ?? ""}</div> <!--Blue 1-->
	<div class="team-blue-2">{teamNumberMap[$blue2] ?? ""}</div> <!--Blue 2-->
	<div class="team-blue-3">{teamNumberMap[$blue3] ?? ""}</div> <!--Blue 3-->
	<div class="team-red-3">{teamNumberMap[$red3 ]?? ""}</div>  <!--Red 3-->
	<div class="team-red-2">{teamNumberMap[$red2 ]?? ""}</div> <!--Red 2-->
	<div class="team-red-1">{teamNumberMap[$red1 ]?? ""}</div> <!--Red 1-->
	
	<svg
    class="vector-timer"
    width="573"
    height="154"
    viewBox="0 0 573 154"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M57.8716 0V154H0L57.8716 0Z" fill="#5A5A5A" />
    <path d="M57.8716 0V154H0L57.8716 0Z" fill="black" fill-opacity="0.24" />
    <path d="M57.8716 0V154H0L57.8716 0Z" fill="#5A5A5A" />
    <path d="M57.8716 0V154H0L57.8716 0Z" fill="black" fill-opacity="0.24" />
    <path d="M57.8716 0V154H0L57.8716 0Z" fill="#5A5A5A" />
    <path d="M57.8716 0V154H0L57.8716 0Z" fill="black" fill-opacity="0.24" />
    <path d="M57.8716 0V154H0L57.8716 0Z" fill="#5A5A5A" />
    <path d="M57.8716 0V154H0L57.8716 0Z" fill="black" fill-opacity="0.24" />
    <path d="M515.128 0V154H573L515.128 0Z" fill="#5A5A5A" />
    <path d="M515.128 0V154H573L515.128 0Z" fill="black" fill-opacity="0.24" />
    <path d="M515.128 0V154H573L515.128 0Z" fill="#5A5A5A" />
    <path d="M515.128 0V154H573L515.128 0Z" fill="black" fill-opacity="0.24" />
    <path d="M515.128 0V154H573L515.128 0Z" fill="#5A5A5A" />
    <path d="M515.128 0V154H573L515.128 0Z" fill="black" fill-opacity="0.24" />
    <path d="M515.128 0V154H573L515.128 0Z" fill="#5A5A5A" />
    <path d="M515.128 0V154H573L515.128 0Z" fill="black" fill-opacity="0.24" />
    <path d="M57.8716 0H515.128V154H57.8716V0Z" fill="#5A5A5A" />
    <path
      d="M57.8716 0H515.128V154H57.8716V0Z"
      fill="black"
      fill-opacity="0.24"
    />
  </svg>

  <svg
    class="vector-scores"
    width="1083"
    height="214"
    viewBox="0 0 1083 214"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M541 214L651.5 107L762 0H541V214Z" fill="#0066B3" />
    <path d="M541 214L651.5 107L762 0H541V214Z" fill="#0066B3" />
    <path d="M541 214L651.5 107L762 0H541V214Z" fill="#0066B3" />
    <path d="M541 214L651.5 107L762 0H541V214Z" fill="#0066B3" />
    <path d="M975.241 214V0H1082.5L975.241 214Z" fill="#0066B3" />
    <path d="M975.241 214V0H1082.5L975.241 214Z" fill="#0066B3" />
    <path d="M975.241 214V0H1082.5L975.241 214Z" fill="#0066B3" />
    <path d="M975.241 214V0H1082.5L975.241 214Z" fill="#0066B3" />
    <path d="M541 214H975.241V0H762L651.5 107L541 214Z" fill="#0066B3" />
    <path d="M541.5 214L431 107L320.5 0H541.5V214Z" fill="#ED1C24" />
    <path d="M541.5 214L431 107L320.5 0H541.5V214Z" fill="#ED1C24" />
    <path d="M541.5 214L431 107L320.5 0H541.5V214Z" fill="#ED1C24" />
    <path d="M541.5 214L431 107L320.5 0H541.5V214Z" fill="#ED1C24" />
    <path d="M107.259 214V0H0L107.259 214Z" fill="#ED1C24" />
    <path d="M107.259 214V0H0L107.259 214Z" fill="#ED1C24" />
    <path d="M107.259 214V0H0L107.259 214Z" fill="#ED1C24" />
    <path d="M107.259 214V0H0L107.259 214Z" fill="#ED1C24" />
    <path d="M541.5 214H107.259V0H320.5L431 107L541.5 214Z" fill="#ED1C24" />
  </svg>

<div class="timer">
	{Math.max(Math.floor($remainingTimeInDisplayPeriod),0)}
	
</div>
<span class="period-icon material-icons">{icons[$matchPeriod]}</span>

<div class="match-text">{$type == "qualification" ? "Qualification" : "Elimination"} Match {$matchNumber}</div>

<div class="event-text">BunnyBots 2023: PLACEHOLDER</div>

<div class="red-score" style="top:{$scoreHeight}">{$redScore}</div>

<div class="blue-score" style="top:{$scoreHeight}">{$blueScore}</div>

<div class="red-alliance" style="display:{$allianceDisplay}">Alliance {$redAlliance}</div>

<div class="blue-alliance" style="display:{$allianceDisplay}">Alliance {$blueAlliance}</div>

<!-- <svg
class="vector5"
width="220"
height="129"
viewBox="0 0 220 129"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M0.500977 0.000244141L49.001 129H219.501L171.001 0.000244141H0.500977Z"
  fill="#2F2F2F"
/>
</svg> -->

<!-- <span class="t material-icons">
	smart_toy
</span> -->
</div>