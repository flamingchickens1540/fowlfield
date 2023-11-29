<script lang="ts">
	import { MatchPeriod } from "@fowltypes";
	import { formatDuration } from "@fowlutils/format";
	import matchData, { remainingTimeInDisplayPeriod, matchPeriod, teamList } from "@store";
	import { fade } from "svelte/transition";
	import { derived, writable } from "svelte/store";
	import socket from "@socket";

	const { red1, red2, red3, blue1, blue2, blue3, redAlliance, blueAlliance, redScore, blueScore, matchNumber, type } = matchData;

	const scoreHeight = derived(type, ($type) => ($type == "qualification" ? "1859px" : "1900px"));
	const allianceDisplay = derived(type, ($type) => ($type == "qualification" ? "none" : "block"));

	const teamNumberMap = {};
	const red1HitCount = writable(0);
	const red2HitCount = writable(0);
	const red3HitCount = writable(0);
	const blue1HitCount = writable(0);
	const blue2HitCount = writable(0);
	const blue3HitCount = writable(0);

	socket.on("robotHitState", (ds, state) => {
		switch (ds) {
			case "R1":
				red1HitCount.set(state.count);
				break;
			case "R2":
				red2HitCount.set(state.count);
				break;
			case "R3":
				red3HitCount.set(state.count);
				break;
			case "B1":
				blue1HitCount.set(state.count);
				break;
			case "B2":
				blue2HitCount.set(state.count);
				break;
			case "B3":
				blue3HitCount.set(state.count);
				break;
		}
	});
    socket.emit("getHitStates", (states) => {
        red1HitCount.set(states.R1.count);
        red2HitCount.set(states.R2.count);
        red3HitCount.set(states.R3.count);
        blue1HitCount.set(states.B1.count);
        blue2HitCount.set(states.B2.count);
        blue3HitCount.set(states.B3.count);
    });


	const icons: { [key in MatchPeriod]: string } = {
		[MatchPeriod.PREMATCH]: "hourglass_top",
		[MatchPeriod.AUTO]: "smart_toy",
		[MatchPeriod.PAUSE]: "",
		[MatchPeriod.TELEOP]: "sports_esports",
		[MatchPeriod.POSTMATCH]: "hourglass_bottom",
	};
</script>

<div class="match">
	<div class="rectangle-8" />
	<div class="rectangle-1" />
	<div class="rectangle-6" />
	<svg class="vector-timer" width="573" height="154" viewBox="0 0 573 154" fill="none" xmlns="http://www.w3.org/2000/svg">
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
		<path d="M57.8716 0H515.128V154H57.8716V0Z" fill="black" fill-opacity="0.24" />
	</svg>

	<svg class="vector2" width="540" height="301" viewBox="0 0 540 301" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M540 301L429.806 150.5L319.612 0H540V301Z" fill="#ED1C24" />
		<path d="M540 301L429.806 150.5L319.612 0H540V301Z" fill="black" fill-opacity="0.2" />
		<path d="M540 301L429.806 150.5L319.612 0H540V301Z" fill="#ED1C24" />
		<path d="M540 301L429.806 150.5L319.612 0H540V301Z" fill="black" fill-opacity="0.2" />
		<path d="M540 301L429.806 150.5L319.612 0H540V301Z" fill="#ED1C24" />
		<path d="M540 301L429.806 150.5L319.612 0H540V301Z" fill="black" fill-opacity="0.2" />
		<path d="M540 301L429.806 150.5L319.612 0H540V301Z" fill="#ED1C24" />
		<path d="M540 301L429.806 150.5L319.612 0H540V301Z" fill="black" fill-opacity="0.2" />
		<path d="M106.962 301V0H0L106.962 301Z" fill="#ED1C24" />
		<path d="M106.962 301V0H0L106.962 301Z" fill="black" fill-opacity="0.2" />
		<path d="M106.962 301V0H0L106.962 301Z" fill="#ED1C24" />
		<path d="M106.962 301V0H0L106.962 301Z" fill="black" fill-opacity="0.2" />
		<path d="M106.962 301V0H0L106.962 301Z" fill="#ED1C24" />
		<path d="M106.962 301V0H0L106.962 301Z" fill="black" fill-opacity="0.2" />
		<path d="M106.962 301V0H0L106.962 301Z" fill="#ED1C24" />
		<path d="M106.962 301V0H0L106.962 301Z" fill="black" fill-opacity="0.2" />
		<path d="M540 301H106.962V0H319.612L429.806 150.5L540 301Z" fill="#ED1C24" />
		<path d="M540 301H106.962V0H319.612L429.806 150.5L540 301Z" fill="black" fill-opacity="0.2" />
	</svg>

	<svg class="vector3" width="551" height="301" viewBox="0 0 551 301" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d_116_514)">
			<path d="M4 301L114.806 150.5L225.612 0H4V301Z" fill="#015FA6" />
			<path d="M4 301L114.806 150.5L225.612 0H4V301Z" fill="black" fill-opacity="0.2" />
			<path d="M4 301L114.806 150.5L225.612 0H4V301Z" fill="#015FA6" />
			<path d="M4 301L114.806 150.5L225.612 0H4V301Z" fill="black" fill-opacity="0.2" />
			<path d="M4 301L114.806 150.5L225.612 0H4V301Z" fill="#015FA6" />
			<path d="M4 301L114.806 150.5L225.612 0H4V301Z" fill="black" fill-opacity="0.2" />
			<path d="M4 301L114.806 150.5L225.612 0H4V301Z" fill="#015FA6" />
			<path d="M4 301L114.806 150.5L225.612 0H4V301Z" fill="black" fill-opacity="0.2" />
			<path d="M439.444 301V0H547L439.444 301Z" fill="#015FA6" />
			<path d="M439.444 301V0H547L439.444 301Z" fill="black" fill-opacity="0.2" />
			<path d="M439.444 301V0H547L439.444 301Z" fill="#015FA6" />
			<path d="M439.444 301V0H547L439.444 301Z" fill="black" fill-opacity="0.2" />
			<path d="M439.444 301V0H547L439.444 301Z" fill="#015FA6" />
			<path d="M439.444 301V0H547L439.444 301Z" fill="black" fill-opacity="0.2" />
			<path d="M439.444 301V0H547L439.444 301Z" fill="#015FA6" />
			<path d="M439.444 301V0H547L439.444 301Z" fill="black" fill-opacity="0.2" />
			<path d="M4 301H439.444V0H225.612L114.806 150.5L4 301Z" fill="#015FA6" />
			<path d="M4 301H439.444V0H225.612L114.806 150.5L4 301Z" fill="black" fill-opacity="0.2" />
		</g>
		<defs>
			<filter id="filter0_d_116_514" x="0" y="0" width="551" height="309" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
				<feOffset dy="4" />
				<feGaussianBlur stdDeviation="2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_116_514" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_116_514" result="shape" />
			</filter>
		</defs>
	</svg>

	<div class="timer">
		{Math.max(Math.floor($remainingTimeInDisplayPeriod), 0)}
	</div>
	<span class="period-icon material-icons">{icons[$matchPeriod]}</span>
	<div class="_15" style="top:{$scoreHeight}">{$redScore}</div>
	<div class="_40" style="top:{$scoreHeight}">{$blueScore}</div>
	<div class="rectangle-100" />
	<!-- Finish integrating the $blueXHitcount variables -->
	<div class="hitMarker {$blue1HitCount >= 3 ? 'hitActive' : ''} ellipse-34">X</div>
	<div class="hitMarker {$blue1HitCount >= 2 ? 'hitActive' : ''} ellipse-35">X</div>
	<div class="hitMarker {$blue1HitCount >= 1 ? 'hitActive' : ''} ellipse-36">X</div>
	<div class="rectangle-101" />
	<div class="hitMarker {$blue2HitCount >= 3 ? 'hitActive' : ''} ellipse-37">X</div>
	<div class="hitMarker {$blue2HitCount >= 2 ? 'hitActive' : ''} ellipse-38">X</div>
	<div class="hitMarker {$blue2HitCount >= 1 ? 'hitActive' : ''} ellipse-39">X</div>
	<div class="rectangle-102" />
	<div class="hitMarker {$blue3HitCount >= 3 ? 'hitActive' : ''} ellipse-40">X</div>
	<div class="hitMarker {$blue3HitCount >= 2 ? 'hitActive' : ''} ellipse-41">X</div>
	<div class="hitMarker {$blue3HitCount >= 1 ? 'hitActive' : ''} ellipse-42">X</div>
	<div class="_5970">{teamNumberMap[$blue3] ?? ""}</div>
	<div class="_59702">{teamNumberMap[$blue2] ?? ""}</div>
	<div class="_59703">{teamNumberMap[$blue1] ?? ""}</div>
	<div class="qualification-match-13">
		{$type == "qualification" ? "Qualification" : "Elimination"} Match {$matchNumber}
	</div>
	<div class="bunny-bots-2023-rabbit-roundup">BunnyBots 2023: Rabbit Roundup</div>
	<div class="rectangle-1002" />
	<div class="hitMarker {$red3HitCount >= 3 ? 'hitActive' : ''} ellipse-342">X</div>
	<div class="hitMarker {$red3HitCount >= 2 ? 'hitActive' : ''} ellipse-352">X</div>
	<div class="hitMarker {$red3HitCount >= 1 ? 'hitActive' : ''} ellipse-362">X</div>
	<div class="rectangle-1012" />
	<div class="hitMarker {$red2HitCount >= 3 ? 'hitActive' : ''} ellipse-372">X</div>
	<div class="hitMarker {$red2HitCount >= 2 ? 'hitActive' : ''} ellipse-382">X</div>
	<div class="hitMarker {$red2HitCount >= 1 ? 'hitActive' : ''} ellipse-392">X</div>
	<div class="rectangle-1022" />
	<div class="hitMarker {$red1HitCount >= 3 ? 'hitActive' : ''} ellipse-402">X</div>
	<div class="hitMarker {$red1HitCount >= 2 ? 'hitActive' : ''} ellipse-412">X</div>
	<div class="hitMarker {$red1HitCount >= 1 ? 'hitActive' : ''} ellipse-422">X</div>
	<div class="_59704">{teamNumberMap[$red1] ?? ""}</div>
	<div class="_59705">{teamNumberMap[$red2] ?? ""}</div>
	<div class="_59706">{teamNumberMap[$red3] ?? ""}</div>

	<div class="red-alliance" style="display:{$allianceDisplay}">Alliance {$redAlliance}</div>
	<div class="blue-alliance" style="display:{$allianceDisplay}">Alliance {$blueAlliance}</div>
</div>

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
<!-- </div> -->

<style lang="scss">
	@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
	@import url("https://fonts.googleapis.com/css2?family=Monomaniac+One&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
	
	.hitMarker {
		color: #00000000;
		font-size: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		&.hitActive {
			color: black;
			background-color: #fbff00;
		}
	}
	.match {
		background-color: #0f0;
	}
	.match,
	.match * {
		box-sizing: border-box;
	}

	.match {
		width: 3840px;
		height: 2160px;
		position: relative;
		overflow: hidden;
	}

	.stream-background {
		width: 3840px;
		height: 2160px;
		position: absolute;
		left: 0;
		top: 0;
	}

	.rectangle-8 {
		background: #353535;
		width: 3840px;
		height: 104px;
		position: absolute;
		left: 0;
		top: 1755px;
		//   box-shadow: 0px -4px 100px 0px rgba(0, 0, 0, 0.6);
	}

	.rectangle-1 {
		background: #ed1c24;
		width: 3840px;
		height: 301px;
		position: absolute;
		left: 0;
		top: 1859px;
	}

	.rectangle-6 {
		background: #0066b3;
		width: 1920px;
		height: 301px;
		position: absolute;
		left: 1920px;
		top: 1859px;
	}

	.vector {
		width: 614px;
		height: 179px;
		position: absolute;
		left: 1615px;
		top: 1680px;
		overflow: visible;
	}

	.vector2 {
		width: 540px;
		height: 301px;
		position: absolute;
		left: 1920px;
		top: 2160px;
		transform: translate(-540px, -301px);
		overflow: visible;
	}

	.vector3 {
		width: 543px;
		height: 301px;
		position: absolute;
		left: 1920px;
		top: 2160px;
		transform: translate(-4px, -301px);
		overflow: visible;
	}

	._128 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 120px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 1511px;
		top: 1680px;
		width: 819px;
		height: 179px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	._15 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 200px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 1489px;
		top: 1859px;
		width: 436px;
		height: 301px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	._40 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 200px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 1923px;
		top: 1859px;
		width: 434px;
		height: 301px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.rectangle-100 {
		background: linear-gradient(to left, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)), linear-gradient(to left, #0075cd, #0075cd);
		border-radius: 20px;
		width: 394px;
		height: 100px;
		position: absolute;
		left: 2502px;
		top: 1900px;
	}

	.ellipse-34 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 2773px;
		top: 1914px;
	}

	.ellipse-35 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 2663px;
		top: 1914px;
	}

	.ellipse-36 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 2553px;
		top: 1914px;
	}

	.rectangle-101 {
		background: linear-gradient(to left, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)), linear-gradient(to left, #0075cd, #0075cd);
		border-radius: 20px;
		width: 394px;
		height: 100px;
		position: absolute;
		left: 2947px;
		top: 1900px;
	}

	.ellipse-37 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 3218px;
		top: 1914px;
	}

	.ellipse-38 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 3108px;
		top: 1914px;
	}

	.ellipse-39 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 2998px;
		top: 1914px;
	}

	.rectangle-102 {
		background: linear-gradient(to left, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)), linear-gradient(to left, #0075cd, #0075cd);
		border-radius: 20px;
		width: 394px;
		height: 100px;
		position: absolute;
		left: 3426px;
		top: 1900px;
	}

	.ellipse-40 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 3697px;
		top: 1914px;
	}

	.ellipse-41 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 3587px;
		top: 1914px;
	}

	.ellipse-42 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 3477px;
		top: 1914px;
	}

	._5970 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 120px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 3426px;
		top: 2000px;
		width: 394px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	._59702 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 120px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 2947px;
		top: 2000px;
		width: 394px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	._59703 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 120px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 2503px;
		top: 2000px;
		width: 394px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.qualification-match-13 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 500 55px "Poppins-Medium", sans-serif;
		position: absolute;
		left: 2172px;
		top: 1755px;
		width: 1668px;
		height: 104px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bunny-bots-2023-rabbit-roundup {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 500 55px "Poppins-Medium", sans-serif;
		position: absolute;
		left: 0;
		top: 1755px;
		width: 1672px;
		height: 104px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.rectangle-1002 {
		background: #981217;
		border-radius: 20px;
		width: 394px;
		height: 100px;
		position: absolute;
		left: 20px;
		top: 1900px;
	}

	.ellipse-342 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 291px;
		top: 1914px;
	}

	.ellipse-352 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 181px;
		top: 1914px;
	}

	.ellipse-362 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 71px;
		top: 1914px;
	}

	.rectangle-1012 {
		background: #981217;
		border-radius: 20px;
		width: 394px;
		height: 100px;
		position: absolute;
		left: 465px;
		top: 1900px;
	}

	.ellipse-372 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 736px;
		top: 1914px;
	}

	.ellipse-382 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 626px;
		top: 1914px;
	}

	.ellipse-392 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 516px;
		top: 1914px;
	}

	.rectangle-1022 {
		background: #981217;
		border-radius: 20px;
		width: 394px;
		height: 100px;
		position: absolute;
		left: 944px;
		top: 1900px;
	}

	.ellipse-402 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 1215px;
		top: 1914px;
	}

	.ellipse-412 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 1105px;
		top: 1914px;
	}

	.ellipse-422 {
		background: #d9d9d9;
		border-radius: 50%;
		width: 73px;
		height: 73px;
		position: absolute;
		left: 995px;
		top: 1914px;
	}

	._59704 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 120px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 944px;
		top: 2000px;
		width: 394px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	._59705 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 120px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 465px;
		top: 2000px;
		width: 394px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	._59706 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 120px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 21px;
		top: 2000px;
		width: 394px;
		height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.vector-timer {
		position: absolute;
		left: 1635px;
		top: 1705px;
		overflow: visible;
	}
	.timer {
		color: #ffffff;
		text-align: center;
		font: 800 120px "Poppins", sans-serif;
		position: absolute;
		left: 1535px;
		top: 1701px;
		width: 764px;
		height: 156px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.period-icon {
		color: #ffffff;
		position: absolute;
		top: 1711px;
		left: 1710px;
		width: 764px;
		height: 156px;
		font-size: 96px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
    @mixin regularText($size: 120px) {
		color: #ffffff;
		text-align: center;
		font: 800 $size "Poppins", sans-serif;
	}
	@mixin alliance-header {
		@include regularText(50px);
		position: absolute;
		top: 1875px;
		width: 436px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.red-alliance {
		@include alliance-header;
		left: 1484px;
	}
	.blue-alliance {
		@include alliance-header;
		left: 1924px;
	}
</style>
