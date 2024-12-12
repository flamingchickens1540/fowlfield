<script lang="ts">
	import { calculatePointsBreakdown } from '~common/utils/scores'
	import matchData, { rankings, teamList } from '~/lib/store'
	import { derived } from 'svelte/store'

	const { red1, red2, red3, blue1, blue2, blue3, stage_index, elim_info, scores, redScore, blueScore} = matchData;

	const teamMap: { [key: number]: { num: string; rank: number; card: string } } = {};

	const colors:Record<string, string> = {
		["red"]: "#ff0000",
		["yellow"]: "#ffff00",
		["none"]: "#00000000",
	};

	type ScheduleItem = {
		title: string;
		winnerTo?: { match: number; alliance: string };
		loserTo?: { match: number; alliance: string };
	};


	const schedule: {[key:number]:ScheduleItem} = { // Makes thinking about the matches easier to avoid the index offset
        1:{
            title:"Match 1",
            winnerTo:{match:3, alliance:"red"},
            loserTo:{match:4, alliance:"red"}
        },
        2:{
            title:"Match 2",
            winnerTo:{match:3, alliance:"blue"},
            loserTo:{match:4, alliance:"blue"},
        },
        3:{
            title:"Match 3",
            winnerTo:{match:6, alliance:"red"},
            loserTo:{match:5, alliance:"red"},
        },
        4:{
            title:"Match 4",
            winnerTo:{match:5, alliance:"blue"},
        },
        5:{
            title:"Match 5",
            winnerTo:{match:6, alliance:"blue"},
        },
		6: {
			title: "Finals",
		}
    };

	$: {
		Object.values($rankings).forEach((ranking, i) => {
			let card = "none";
			switch (ranking.team) {
				case $red1: card = $scores.red.card_robot1; break;
				case $red2: card = $scores.red.card_robot2; break;
				case $red3: card = $scores.red.card_robot3; break;
				case $blue1: card = $scores.blue.card_robot1; break;
				case $blue2: card = $scores.blue.card_robot2; break;
				case $blue3: card = $scores.blue.card_robot3; break;
			}

			if (card == "none" && $teamList[ranking.team].has_card.get()) {
				card = "yellow";
			}

			teamMap[ranking.team] = {
				num: $teamList[ranking.team].display_number.get(),
				rank: i + 1,
				card: colors[card],
			};
		});
	}

	
	const breakdown = derived(scores, ($scores) => calculatePointsBreakdown($scores));
	$: blueWon = $blueScore > $redScore;
	$: tie = $blueScore == $redScore;
	let redAllianceTo:string, blueAllianceTo:string;
	$: {
		if (tie) {
			redAllianceTo = "Replay";
			blueAllianceTo = "Replay";
		} else if (blueWon) {
			if (schedule[$stage_index]?.loserTo != null) {
				redAllianceTo = "Advances to "+schedule[schedule[$stage_index].loserTo!.match]?.title
			} else {
				redAllianceTo = "Eliminated";
			}
			blueAllianceTo = "Advances to "+ schedule[schedule[$stage_index]?.winnerTo?.match ?? -1]?.title
		} else {
			redAllianceTo = "Advances to "+ schedule[schedule[$stage_index]?.winnerTo?.match ?? -1]?.title
			if (schedule[$stage_index]?.loserTo != null) {
				blueAllianceTo = "Advances to "+schedule[schedule[$stage_index]?.loserTo!.match]?.title
			} else {
				blueAllianceTo = "Eliminated";
			}
		}
		console.log("Winner", blueWon, $stage_index)
	}
</script>

<div class="final-scores" style="clip-path:polygon(148px 87px, 3692px 87px, 3490px 2060px, 350px 2060px)">
	<svg class="background" width="3548" height="1994" viewBox="0 0 3548 1994" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d_95_212)">
			<path d="M971.858 1985.07L774.354 992.537L576.851 0H971.858V1985.07Z" fill="#ED1C24" />
			<path d="M971.858 1985.07L774.354 992.537L576.851 0H971.858V1985.07Z" fill="#ED1C24" />
			<path d="M971.858 1985.07L774.354 992.537L576.851 0H971.858V1985.07Z" fill="#ED1C24" />
			<path d="M971.858 1985.07L774.354 992.537L576.851 0H971.858V1985.07Z" fill="#ED1C24" />
			<path d="M195.711 1985.07V0H3.99976L195.711 1985.07Z" fill="#ED1C24" />
			<path d="M195.711 1985.07V0H3.99976L195.711 1985.07Z" fill="#ED1C24" />
			<path d="M195.711 1985.07V0H3.99976L195.711 1985.07Z" fill="#ED1C24" />
			<path d="M195.711 1985.07V0H3.99976L195.711 1985.07Z" fill="#ED1C24" />
			<path d="M971.858 1985.07H195.711V0H576.851L774.354 992.537L971.858 1985.07Z" fill="#ED1C24" />
			<path d="M971.858 1985.07H195.711V0H576.851L774.354 992.537L971.858 1985.07Z" fill="#ED1C24" />
		</g>
		<path d="M2580.14 1985.07L2777.65 992.537L2975.15 0H2580.14V1985.07Z" fill="#0066B3" />
		<path d="M2580.14 1985.07L2777.65 992.537L2975.15 0H2580.14V1985.07Z" fill="#0066B3" />
		<path d="M2580.14 1985.07L2777.65 992.537L2975.15 0H2580.14V1985.07Z" fill="#0066B3" />
		<path d="M2580.14 1985.07L2777.65 992.537L2975.15 0H2580.14V1985.07Z" fill="#0066B3" />
		<path d="M3356.29 1985.07V0H3548L3356.29 1985.07Z" fill="#0066B3" />
		<path d="M3356.29 1985.07V0H3548L3356.29 1985.07Z" fill="#0066B3" />
		<path d="M3356.29 1985.07V0H3548L3356.29 1985.07Z" fill="#0066B3" />
		<path d="M3356.29 1985.07V0H3548L3356.29 1985.07Z" fill="#0066B3" />
		<path d="M2580.14 1985.07H3356.29V0H2975.15L2777.65 992.537L2580.14 1985.07Z" fill="#0066B3" />
		<path d="M2580.14 1985.07H3356.29V0H2975.15L2777.65 992.537L2580.14 1985.07Z" fill="#0066B3" />
		<rect x="971.858" y="0.000244141" width="804.141" height="1985.07" fill="#ED1C24" />
		<rect x="1776" y="0.000244141" width="804.141" height="1985.07" fill="#0066B3" />
		<defs>
			<filter id="filter0_d_95_212" x="0" y="0" width="975.858" height="1993.07" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
				<feOffset dy="4" />
				<feGaussianBlur stdDeviation="2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_95_212" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_95_212" result="shape" />
			</filter>
		</defs>
	</svg>

	<svg class="background2" width="3544.00048828125" height="1985.0736083984375" />

	<div class="winner" class:tie class:blue={blueWon}>WINNER!</div>
	<svg class="winner-rectangle" class:tie class:blue={blueWon} width="1282" height="397" viewBox="0 0 1282 397" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 0H1135.36L1282 198.5L1135.36 397H0V198.5V0Z" fill="#FFF500" />
	</svg>

	<svg class="rectangle-64" width="1282" height="397" viewBox="0 0 1282 397" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1282 0H146.641L0 198.5L146.641 397H1282V198.5V0Z" fill="#FFF500" />
	</svg>

	<svg class="rectangle-59" width="969" height="397" viewBox="0 0 969 397" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M-313 0H822.359L969 198.5L822.359 397H-313V198.5V0Z" fill="#920006" />
	</svg>

	<svg class="rectangle-60" width="965" height="397" viewBox="0 0 965 397" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1282 0H146.641L0 198.5L146.641 397H1282V198.5V0Z" fill="#00477D" />
	</svg>

	<svg class="rectangle-46" width="802" height="292" viewBox="0 0 802 292" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M-144 0H693.792L802 146L693.792 292H-144V146V0Z" fill="#920006" />
	</svg>

	<svg class="rectangle-47" width="802" height="292" viewBox="0 0 802 292" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M-144 0H693.792L802 146L693.792 292H-144V146V0Z" fill="#920006" />
	</svg>

	<svg class="rectangle-48" width="802" height="292" viewBox="0 0 802 292" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M-144 0H693.792L802 146L693.792 292H-144V146V0Z" fill="#920006" />
	</svg>

	<svg class="rectangle-56" width="798" height="292" viewBox="0 0 798 292" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M946 0H108.208L0 146L108.208 292H946V146V0Z" fill="#00477D" />
	</svg>

	<svg class="rectangle-57" width="798" height="292" viewBox="0 0 798 292" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M946 0H108.208L0 146L108.208 292H946V146V0Z" fill="#00477D" />
	</svg>

	<svg class="rectangle-58" width="798" height="292" viewBox="0 0 798 292" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M946 0H108.208L0 146L108.208 292H946V146V0Z" fill="#00477D" />
	</svg>

	<!-- Red Score Breakdown -->
	<div class="_200">{$redScore}</div>
	<div class="total">TOTAL</div>
	<div class="_100">{$breakdown.red.tote_balloons}</div>
	<div class="hybrid">TOTE</div>
	<div class="_95">{$breakdown.red.low_zone_balloon+$breakdown.red.low_zone_bunny}</div>
	<div class="teleop">LOWZONE</div>
	<div class="_5">{$breakdown.red.foul}</div>
	<div class="fouls">FOULS</div>

	<!-- Blue Score Breakdown -->
	<div class="_190">{$blueScore}</div>
	<div class="total2">TOTAL</div>
	<div class="_952">{$breakdown.blue.tote_balloons}</div>
	<div class="hybrid2">TOTE</div>
	<div class="_52">{$breakdown.blue.low_zone_balloon+$breakdown.blue.low_zone_bunny}</div>
	<div class="teleop2">LOWZONE</div>
	<div class="_90">{$breakdown.blue.foul}</div>
	<div class="fouls2">FOULS</div>

	<!-- Red Alliance -->
	<div class="alliance red">Alliance {$elim_info?.red_alliance}</div>
	<svg class="rectangle-73" width="700" height="150" viewBox="0 0 700 150" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M657 0H40C21.1438 0 11.7157 0 5.85785 5.85786C0 11.7157 0 21.1438 0 40V74.1481V108.296C0 127.152 0 136.58 5.85785 142.438C11.7157 148.296 21.1438 148.296 40 148.296H657V74.1481V0Z" fill="#920006" />
	</svg>

	{#if $stage_index < 6}
	<svg class="advancement red" width="1500" height="190" viewBox="0 0 1500 190" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1500 0H40C21.1438 0 11.7157 0 5.85791 5.85786C0 11.7157 0 21.1438 0 40V95V150C0 168.856 0 178.284 5.85791 184.142C11.7157 190 21.1438 190 40 190H1500V95V0Z" fill="#920006" />
	</svg>
	<div class="advancement-text red">{redAllianceTo}</div>
	{/if}

	<!-- Blue alliance -->
	<div class="alliance blue">Alliance {$elim_info?.blue_alliance}</div>
	<svg class="rectangle-83" width="700" height="150" viewBox="0 0 700 150" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 0H654C672.856 0 682.284 0 688.142 5.85786C694 11.7157 694 21.1438 694 40V74.1481V108.296C694 127.152 694 136.58 688.142 142.438C682.284 148.296 672.856 148.296 654 148.296H0V74.1481V0Z" fill="#00477D" />
	</svg>

	{#if $stage_index < 6}
	<svg class="advancement blue" width="1500" height="190" viewBox="0 0 1500 190" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 190H1460C1478.86 190 1488.28 190 1494.14 184.142C1500 178.284 1500 168.856 1500 150V95V40C1500 21.1438 1500 11.7157 1494.14 5.85786C1488.28 0 1478.86 0 1460 0H0V95V190Z" fill="#00477D" />
	</svg>
	<div class="advancement-text blue">{blueAllianceTo}</div>
	{/if}

	<div>
		<!-- Red 1 -->
		<svg class="group-19" width="600" height="300" viewBox="0 0 813 279" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M813 0H40C21.1438 0 11.7157 0 5.85785 5.85786C0 11.7157 0 21.1438 0 40V139.148V238.296C0 257.152 0 266.58 5.85785 272.438C11.7157 278.296 21.1438 278.296 40 278.296H813V139.148V0Z" fill="#920006" />
		</svg>
		<div class="_1540-d">{teamMap[$red1]?.num ?? ""}</div>
	</div>

	<!-- Red 2 -->
	<div class="group-20">
		<svg class="rectangle-66" width="600" height="300" viewBox="0 0 813 279" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M813 0.453857H40C21.1438 0.453857 11.7157 0.453857 5.85785 6.31172C0 12.1696 0 21.5977 0 40.4539V139.602V238.75C0 257.606 0 267.034 5.85785 272.892C11.7157 278.75 21.1438 278.75 40 278.75H813V139.602V0.453857Z" fill="#920006" />
		</svg>

		<div class="_1540-c">{teamMap[$red2]?.num ?? ""}</div>
	</div>

	<!-- Red 3 -->
	<div class="group-21">
		<svg class="rectangle-74" width="600" height="300" viewBox="0 0 813 279" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M813 0.0769043H40C21.1438 0.0769043 11.7157 0.0769043 5.85785 5.93477C0 11.7926 0 21.2207 0 40.0769V139.225V238.373C0 257.229 0 266.657 5.85785 272.515C11.7157 278.373 21.1438 278.373 40 278.373H813V139.225V0.0769043Z" fill="#920006" />
		</svg>

		<div class="_1540-z">{teamMap[$red3]?.num ?? ""}</div>
	</div>

	<!-- Blue 1 -->
	<div>
		<svg class="rectangle-75" width="600" height="300" viewBox="0 0 813 278" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0H773C791.856 0 801.284 0 807.142 5.85786C813 11.7157 813 21.1438 813 40V139V238C813 256.856 813 266.284 807.142 272.142C801.284 278 791.856 278 773 278H0V139V0Z" fill="#00477D" />
		</svg>
		<div class="_1540-q">{teamMap[$blue1]?.num ?? ""}</div>
	</div>

	<!-- Blue 2 -->
	<div>
		<svg class="rectangle-76" width="600" height="300" viewBox="0 0 813 279" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0H773C791.856 0 801.284 0 807.142 5.85786C813 11.7157 813 21.1438 813 40V139.5V239C813 257.856 813 267.284 807.142 273.142C801.284 279 791.856 279 773 279H0V139.5V0Z" fill="#00477D" />
		</svg>
		<div class="_1540-a">{teamMap[$blue2]?.num ?? ""}</div>
	</div>

	<!-- Blue 3 -->
	<div>
		<svg class="rectangle-77" width="600" height="300" viewBox="0 0 813 278" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0H773C791.856 0 801.284 0 807.142 5.85786C813 11.7157 813 21.1438 813 40V139V238C813 256.856 813 266.284 807.142 272.142C801.284 278 791.856 278 773 278H0V139V0Z" fill="#00477D" />
		</svg>
		<div class="_1540-p">{teamMap[$blue3]?.num ?? ""}</div>
	</div>

	<!-- Footer -->
	<div class="rectangle-72" />
	<div class="qualification-match-13">Elimination Match {$stage_index}</div>
	<div class="bunny-bots-2023-rabbit-roundup">BunnyBots 2024</div>
</div>

<style lang="scss">

	@mixin team($level, $isRed) {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 700 130px "Poppins-Bold", sans-serif;
		position: absolute;
		left: 1925px;
		@if $isRed {
			transform: translate(-600px, 0px);
		}
		@if $level == 1 {
			top:840px;
		}
		@if $level == 2 {
			top: 1130px;
		}
		@if $level == 3 {
			top: 1420px;
		}
		width: 600px;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.final-scores,
	.final-scores * {
		box-sizing: border-box;
	}
	.final-scores {
		background: #1c1c1c;
		width: 3840px;
		height: 2160px;
		position: relative;
		overflow: hidden;
	}
	.background {
		height: auto;
		position: absolute;
		left: 148px;
		top: 87px;
		overflow: visible;
	}
	.background2 {
		height: auto;
		position: absolute;
		left: 148px;
		top: 87px;
		overflow: visible;
	}
	.rectangle-32 {
		width: 1282px;
		height: 397px;
		position: absolute;
		left: -169px;
		top: 257px;
		overflow: visible;
	}
	.winner-rectangle {
		width: 1282px;
		height: 400px;
		position: absolute;
		left: 546px;
		top: 127px;
		&.tie {
			display: none;
		}
		&.blue {
			transform: scale(-1, 1);
			left: 1992px;
		}
		overflow: visible;
	}
	.rectangle-59 {
		width: 1282px;
		height: 400px;
		position: absolute;
		left: -169px;
		top: 127px;
		overflow: visible;
	}
	.rectangle-60 {
		width: 1282px;
		height: 400px;
		position: absolute;
		left: 4009px;
		top: 127px;
		transform: translate(-1282px, 0px);
		overflow: visible;
	}
	._200 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 200px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 295px;
		top: 263px;
		width: 523px;
		height: 245px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.total {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 130px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 295px;
		top: 182px;
		width: 523px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.winner {
		color: #000000;
		text-align: center;
		font: 800 130px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 1050px;
		top: 229px;
		width: 626px;
		height: 199px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		&.tie {
			display: none;
		}
		&.blue {
			left: 2150px;
		}
	}
	.rectangle-46 {
		width: 946px;
		height: 292px;
		position: absolute;
		left: 0;
		top: 570px;
		overflow: visible;
	}
	.rectangle-47 {
		width: 946px;
		height: 292px;
		position: absolute;
		left: 0;
		top: 902px;
		overflow: visible;
	}
	.rectangle-48 {
		width: 946px;
		height: 292px;
		position: absolute;
		left: 0;
		top: 1243px;
		overflow: visible;
	}
	.rectangle-56 {
		width: 946px;
		height: 292px;
		position: absolute;
		left: 3840px;
		top: 570px;
		transform: translate(-946px, 0px);
		overflow: visible;
	}
	.rectangle-57 {
		width: 946px;
		height: 292px;
		position: absolute;
		left: 3840px;
		top: 902px;
		transform: translate(-946px, 0px);
		overflow: visible;
	}
	.rectangle-58 {
		width: 946px;
		height: 292px;
		position: absolute;
		left: 3840px;
		top: 1243px;
		transform: translate(-946px, 0px);
		overflow: visible;
	}
	._100 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 150px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 295px;
		top: 632px;
		width: 523px;
		height: 245px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.hybrid {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 100px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 295px;
		top: 591px;
		width: 523px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._95 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 150px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 295px;
		top: 973px;
		width: 523px;
		height: 245px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.teleop {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 90px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 260px;
		top: 932px;
		width: 523px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._5 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 150px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 295px;
		top: 1327px;
		width: 523px;
		height: 245px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.fouls {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 100px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 295px;
		top: 1286px;
		width: 523px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._190 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 200px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 3025px;
		top: 263px;
		width: 523px;
		height: 245px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.total2 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 130px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 3025px;
		top: 182px;
		width: 523px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._952 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 150px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 3025px;
		top: 632px;
		width: 523px;
		height: 245px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.hybrid2 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 100px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 3025px;
		top: 591px;
		width: 523px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._52 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 150px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 3025px;
		top: 973px;
		width: 523px;
		height: 245px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.group-19 {
		height: auto;
		position: absolute;
		left: 1324px;
		top: 740px;
		overflow: visible;
	}
	.teleop2 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 90px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 3060px;
		top: 932px;
		width: 523px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._90 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 800 150px "Poppins-ExtraBold", sans-serif;
		position: absolute;
		left: 3025px;
		top: 1327px;
		width: 523px;
		height: 245px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.fouls2 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 100px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 3025px;
		top: 1286px;
		width: 523px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._1540-d {
		@include team(1, true)
	}
	._3 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 130px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 1672px;
		top: 858px;
		width: 248px;
		height: 103px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.rectangle-75 {
		border-radius: 0;
		width: 600px;
		height: 278px;
		position: absolute;
		left: 1924px;
		top: 750px;
		overflow: visible;
	}
	.rectangle-76 {
		border-radius: 0;
		width: 600px;
		height: 279px;
		position: absolute;
		left: 1924px;
		top: 1040px;
		overflow: visible;
	}
	.rectangle-77 {
		border-radius: 0;
		width: 600px;
		height: 278px;
		position: absolute;
		left: 1924px;
		top: 1330px;
		overflow: visible;
	}
	.group-20 {
		position: absolute;
		inset: 0;
	}
	.rectangle-66 {
		border-radius: 0;
		width: 600px;
		height: 300px;
		position: absolute;
		left: 2138px;
		top: 1030px;
		transform: translate(-813px, 0px);
		overflow: visible;
	}
	._1540-c {
		@include team(2, true)
	}
	._21 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 130px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 1671.93px;
		top: 1185.09px;
		width: 248.07px;
		height: 103.19px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.group-21 {
		position: absolute;
		inset: 0;
	}
	.rectangle-74 {
		border-radius: 0;
		width: 600px;
		height: 300px;
		position: absolute;
		left: 2138px;
		top: 1320px;
		transform: translate(-813px, 0px);
		overflow: visible;
	}
	._1540-z {
		@include team(3, true)
	}
	._15 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 130px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 1671.93px;
		top: 1512.38px;
		width: 248.07px;
		height: 103.19px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.card-red {
		width: 60px;
		height: 110px;
		position: absolute;
		left: 1650px;
	}

	.card-blue {
		background: #fff500;
		width: 60px;
		height: 110px;
		position: absolute;
		left: 2135px;
	}
	.rectangle-72 {
		background: #353535;
		width: 3477px;
		height: 311px;
		position: absolute;
		left: 215px;
		top: 1822px;
	}
	.qualification-match-13 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 100px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 2116px;
		top: 1847px;
		width: 1533px;
		height: 186px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bunny-bots-2023-rabbit-roundup {
		color: rgba(255, 255, 255, 0.95);
		text-align: left;
		font: 600 100px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 398px;
		top: 1826px;
		width: 1735px;
		height: 246px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	._1540-q {
		@include team(1, false)
	}
	._1 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 130px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 1924px;
		top: 854px;
		width: 248px;
		height: 103px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._1540-a {
		@include team(2, false)
	}
	._4 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 130px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 1924px;
		top: 1185px;
		width: 248px;
		height: 103px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	._1540-p {
		@include team(3, false);
	}
	._32 {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 130px "Poppins-SemiBold", sans-serif;
		position: absolute;
		left: 1924px;
		top: 1522px;
		width: 248px;
		height: 103px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.rectangle-73 {
		border-radius: 0;
		position: absolute;
		left: 1925px;
		top: 590px;
		transform: translate(-657px, 0px);
		overflow: visible;
	}
	.rectangle-83 {
		border-radius: 0;
		position: absolute;
		left: 1925px;
		top: 590px;
		overflow: visible;
	}
	.alliance {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 600 100px "Poppins-Bold", sans-serif;
		position: absolute;
		width: 669px;
		height: 103px;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 620px;
		z-index: 100;
		&.blue {
			left: 1925px;
		}
		&.red {
			left: 1250px;
		}
	}
	.advancement {
		border-radius: 0;
		width: 1500px;
		height: 190px;
		position: absolute;
		top: 1600px;
		left: 1925px;
		&.red {
			transform: translate(-1500px, 0px);
		}
		overflow: visible;
	}
	.advancement-text {
		color: rgba(255, 255, 255, 0.95);
		text-align: center;
		font: 700 110px "Poppins-Bold", sans-serif;
		position: absolute;
		width: 1500px;
		height: 189px;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 1610px;
		z-index: 100;
		&.blue {
			left: 1925px;
		}
		&.red {
			left: 1925px;
			transform: translate(-1500px, 0px);
		}
	}
</style>
