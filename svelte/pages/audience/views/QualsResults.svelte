<script lang="ts">
    // import { Card } from '~common/types'
    import { calculatePointsBreakdown } from '~common/utils/scores'
    import matchData, { rankings, teamList } from '~/lib/store'
    import { derived } from 'svelte/store'

    const { red1, red2, red3, blue1, blue2, blue3, stage_index, scores, redScore, blueScore } = matchData
    const teamMap: { [key: number]: { num: string; rank: number; card: string } } = {}

    const colors: Record<string, string> = {
        ['red']: '#ff0000',
        ['yellow']: '#ffff00',
        ['none']: '#00000000'
    }

    $: {
        Object.values($rankings).forEach((ranking, i) => {
            let card = 'none'
            switch (ranking.team) {
                case $red1:
                    card = $scores.red.card_robot1
                    break
                case $red2:
                    card = $scores.red.card_robot2
                    break
                case $red3:
                    card = $scores.red.card_robot3
                    break
                case $blue1:
                    card = $scores.blue.card_robot1
                    break
                case $blue2:
                    card = $scores.blue.card_robot2
                    break
                case $blue3:
                    card = $scores.blue.card_robot3
                    break
            }

            if (card == 'none' && $teamList[ranking.team].has_card.get()) {
                card = 'yellow'
            }

            teamMap[ranking.team] = {
                num: $teamList[ranking.team].display_number.get(),
                rank: i + 1,
                card: colors[card]
            }
        })
    }

    const breakdown = derived(scores, ($scores) => calculatePointsBreakdown($scores))
    $: blueWon = $blueScore > $redScore
    $: tie = $blueScore == $redScore
    $: empty = $scores.corral_empty
</script>

<div class="final-scores" style="clip-path:polygon(148px 87px, 3692px 87px, 3490px 2060px, 350px 2060px)">
    <img src="handshake.png" alt="Co-op Point Achieved" id="clear" style={`display: ${empty ? 'block' : 'none'};`} />
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

    <svg class="rectangle-32" width="969" height="397" viewBox="0 0 969 397" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-313 0H822.359L969 198.5L822.359 397H-313V198.5V0Z" fill="#920006" />
    </svg>

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
    <div class="_100">{$breakdown.red.auto_carrots + $breakdown.red.tele_carrots}</div>
    <div class="hybrid">CARROTS</div>
    <div class="_95">{$breakdown.red.tele_bunnies}</div>
    <div class="teleop">BUNNIES</div>
    <div class="_5">{$breakdown.red.foul}</div>
    <div class="fouls">FOULS</div>

    <!-- Blue Score Breakdown -->
    <div class="_190">{$blueScore}</div>
    <div class="total2">TOTAL</div>
    <div class="_952">{$breakdown.blue.auto_carrots + $breakdown.blue.tele_carrots}</div>
    <div class="hybrid2">CARROTS</div>
    <div class="_52">{$breakdown.blue.tele_bunnies}</div>
    <div class="teleop2">BUNNIES</div>
    <div class="_90">{$breakdown.blue.foul}</div>
    <div class="fouls2">FOULS</div>

    <div>
        <!-- Red 1 -->
        <svg class="group-19" width="813" height="279" viewBox="0 0 813 279" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M813 0H40C21.1438 0 11.7157 0 5.85785 5.85786C0 11.7157 0 21.1438 0 40V139.148V238.296C0 257.152 0 266.58 5.85785 272.438C11.7157 278.296 21.1438 278.296 40 278.296H813V139.148V0Z" fill="#920006" />
        </svg>
        <div class="_1540-d">{teamMap[$red1]?.num ?? ''}</div>
        <div class="_3">{teamMap[$red1]?.rank ?? ''}</div>
        <div class="card-red" style="top:850px;background-color:{teamMap[$red1]?.card ?? '#00000000'}" />
    </div>

    <!-- Red 2 -->
    <div class="group-20">
        <svg class="rectangle-66" width="813" height="279" viewBox="0 0 813 279" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M813 0.453857H40C21.1438 0.453857 11.7157 0.453857 5.85785 6.31172C0 12.1696 0 21.5977 0 40.4539V139.602V238.75C0 257.606 0 267.034 5.85785 272.892C11.7157 278.75 21.1438 278.75 40 278.75H813V139.602V0.453857Z" fill="#920006" />
        </svg>

        <div class="_1540-c">{teamMap[$red2]?.num ?? ''}</div>
        <div class="_21">{teamMap[$red2]?.rank ?? ''}</div>
        <div class="card-red" style="top:1180px;background-color:{teamMap[$red2]?.card ?? '#00000000'}" />
    </div>

    <!-- Red 3 -->
    <div class="group-21">
        <svg class="rectangle-74" width="813" height="279" viewBox="0 0 813 279" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M813 0.0769043H40C21.1438 0.0769043 11.7157 0.0769043 5.85785 5.93477C0 11.7926 0 21.2207 0 40.0769V139.225V238.373C0 257.229 0 266.657 5.85785 272.515C11.7157 278.373 21.1438 278.373 40 278.373H813V139.225V0.0769043Z" fill="#920006" />
        </svg>

        <div class="_1540-z">{teamMap[$red3]?.num ?? ''}</div>
        <div class="_15">{teamMap[$red3]?.rank ?? ''}</div>
        <div class="card-red" style="top:1510px; background-color:{teamMap[$red3]?.card ?? '#00000000'}" />
    </div>

    <!-- Blue 1 -->
    <div>
        <svg class="rectangle-75" width="813" height="278" viewBox="0 0 813 278" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H773C791.856 0 801.284 0 807.142 5.85786C813 11.7157 813 21.1438 813 40V139V238C813 256.856 813 266.284 807.142 272.142C801.284 278 791.856 278 773 278H0V139V0Z" fill="#00477D" />
        </svg>
        <div class="_1540-q">{teamMap[$blue1]?.num ?? ''}</div>
        <div class="_1">{teamMap[$blue1]?.rank ?? ''}</div>
        <div class="card-blue" style="top:850px;background-color:{teamMap[$blue1]?.card ?? '#00000000'}" />
    </div>

    <!-- Blue 2 -->
    <div>
        <svg class="rectangle-76" width="813" height="279" viewBox="0 0 813 279" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H773C791.856 0 801.284 0 807.142 5.85786C813 11.7157 813 21.1438 813 40V139.5V239C813 257.856 813 267.284 807.142 273.142C801.284 279 791.856 279 773 279H0V139.5V0Z" fill="#00477D" />
        </svg>
        <div class="_1540-a">{teamMap[$blue2]?.num ?? ''}</div>
        <div class="_4">{teamMap[$blue2]?.rank ?? ''}</div>
        <div class="card-blue" style="top:1180px;background-color:{teamMap[$blue2]?.card ?? '#00000000'}" />
    </div>

    <!-- Blue 3 -->
    <div>
        <svg class="rectangle-77" width="813" height="278" viewBox="0 0 813 278" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H773C791.856 0 801.284 0 807.142 5.85786C813 11.7157 813 21.1438 813 40V139V238C813 256.856 813 266.284 807.142 272.142C801.284 278 791.856 278 773 278H0V139V0Z" fill="#00477D" />
        </svg>
        <div class="_1540-p">{teamMap[$blue3]?.num ?? ''}</div>
        <div class="_32">{teamMap[$blue3]?.rank ?? ''}</div>
        <div class="card-blue" style="top:1510px;background-color:{teamMap[$blue3]?.card ?? '#00000000'}" />
    </div>

    <!-- Footer -->
    <div class="rectangle-72" />
    <div class="qualification-match-13">Qualification Match {$stage_index}</div>
    <div class="bunny-bots-2023-rabbit-roundup">BunnyBots 2024</div>
</div>

<style lang="scss">
    #clear {
        z-index: 999;
        position: absolute;
        top: 24%;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.75);
        border-radius: 20px;
        padding: 20px;
        transform: translate(-50%);
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
        left: 450px;
        top: 250px;
        &.tie {
            display: none;
        }
        &.blue {
            transform: scale(-1, 1);
            left: 2100px;
        }
        overflow: visible;
    }
    .rectangle-59 {
        width: 1282px;
        height: 400px;
        position: absolute;
        left: -169px;
        top: 250px;
        overflow: visible;
    }
    .rectangle-60 {
        width: 1282px;
        height: 400px;
        position: absolute;
        left: 4009px;
        top: 250px;
        transform: translate(-1282px, 0px);
        overflow: visible;
    }
    ._200 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 200px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 295px;
        top: 386px;
        width: 523px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .total {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 130px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 295px;
        top: 305px;
        width: 523px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .winner {
        color: #000000;
        text-align: center;
        font:
            800 130px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 1000px;
        top: 352px;
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
            left: 2225px;
        }
    }
    .rectangle-46 {
        width: 946px;
        height: 292px;
        position: absolute;
        left: 0;
        top: 693px;
        overflow: visible;
    }
    .rectangle-47 {
        width: 946px;
        height: 292px;
        position: absolute;
        left: 0;
        top: 1025px;
        overflow: visible;
    }
    .rectangle-48 {
        width: 946px;
        height: 292px;
        position: absolute;
        left: 0;
        top: 1366px;
        overflow: visible;
    }
    .rectangle-56 {
        width: 946px;
        height: 292px;
        position: absolute;
        left: 3840px;
        top: 693px;
        transform: translate(-946px, 0px);
        overflow: visible;
    }
    .rectangle-57 {
        width: 946px;
        height: 292px;
        position: absolute;
        left: 3840px;
        top: 1025px;
        transform: translate(-946px, 0px);
        overflow: visible;
    }
    .rectangle-58 {
        width: 946px;
        height: 292px;
        position: absolute;
        left: 3840px;
        top: 1367px;
        transform: translate(-946px, 0px);
        overflow: visible;
    }
    ._100 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 150px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 295px;
        top: 755px;
        width: 523px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .hybrid {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 100px 'Poppins-SemiBold',
            sans-serif;
        position: absolute;
        left: 295px;
        top: 714px;
        width: 523px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._95 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 150px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 295px;
        top: 1096px;
        width: 523px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .teleop {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 90px 'Poppins-SemiBold',
            sans-serif;
        position: absolute;
        left: 280px;
        top: 1055px;
        width: 523px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._5 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 150px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 295px;
        top: 1450px;
        width: 523px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .fouls {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 100px 'Poppins-SemiBold',
            sans-serif;
        position: absolute;
        left: 295px;
        top: 1409px;
        width: 523px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._190 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 200px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 3025px;
        top: 386px;
        width: 523px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .total2 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 130px 'Poppins-SemiBold',
            sans-serif;
        position: absolute;
        left: 3025px;
        top: 305px;
        width: 523px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._952 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 150px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 3025px;
        top: 755px;
        width: 523px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .hybrid2 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 100px 'Poppins-SemiBold',
            sans-serif;
        position: absolute;
        left: 3025px;
        top: 714px;
        width: 523px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._52 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 150px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 3025px;
        top: 1096px;
        width: 523px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .group-19 {
        height: auto;
        position: absolute;
        left: 1111px;
        top: 764px;
        overflow: visible;
    }
    .teleop2 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 90px 'Poppins-SemiBold',
            sans-serif;
        position: absolute;
        left: 3050px;
        top: 1055px;
        width: 523px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._90 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            800 150px 'Poppins-ExtraBold',
            sans-serif;
        position: absolute;
        left: 3025px;
        top: 1450px;
        width: 523px;
        height: 245px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .fouls2 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 100px 'Poppins-SemiBold',
            sans-serif;
        position: absolute;
        left: 3025px;
        top: 1409px;
        width: 523px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._1540-d {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            700 130px 'Poppins-Bold',
            sans-serif;
        position: absolute;
        left: 1114px;
        top: 858px;
        width: 505px;
        height: 103px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._3 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 130px 'Poppins-SemiBold',
            sans-serif;
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
        width: 813px;
        height: 278px;
        position: absolute;
        left: 1924px;
        top: 764px;
        overflow: visible;
    }
    .rectangle-76 {
        border-radius: 0;
        width: 813px;
        height: 279px;
        position: absolute;
        left: 1924px;
        top: 1095px;
        overflow: visible;
    }
    .rectangle-77 {
        border-radius: 0;
        width: 813px;
        height: 278px;
        position: absolute;
        left: 1924px;
        top: 1431px;
        overflow: visible;
    }
    .group-20 {
        position: absolute;
        inset: 0;
    }
    .rectangle-66 {
        border-radius: 0;
        width: 813px;
        height: 278.3px;
        position: absolute;
        left: 1925px;
        top: 1095.45px;
        transform: translate(-813px, 0px);
        overflow: visible;
    }
    ._1540-c {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            700 130px 'Poppins-Bold',
            sans-serif;
        position: absolute;
        left: 1115.34px;
        top: 1185.09px;
        width: 504.48px;
        height: 103.19px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._21 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 130px 'Poppins-SemiBold',
            sans-serif;
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
        width: 813px;
        height: 278.3px;
        position: absolute;
        left: 1925px;
        top: 1431.08px;
        transform: translate(-813px, 0px);
        overflow: visible;
    }
    ._1540-z {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            700 130px 'Poppins-Bold',
            sans-serif;
        position: absolute;
        left: 1114.3px;
        top: 1512.38px;
        width: 504.48px;
        height: 103.19px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._15 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 130px 'Poppins-SemiBold',
            sans-serif;
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
        font:
            600 100px 'Poppins-SemiBold',
            sans-serif;
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
        font:
            600 100px 'Poppins-SemiBold',
            sans-serif;
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
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            700 130px 'Poppins-Bold',
            sans-serif;
        position: absolute;
        left: 2173px;
        top: 854px;
        width: 504px;
        height: 103px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._1 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 130px 'Poppins-SemiBold',
            sans-serif;
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
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            700 130px 'Poppins-Bold',
            sans-serif;
        position: absolute;
        left: 2173px;
        top: 1190px;
        width: 504px;
        height: 103px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._4 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 130px 'Poppins-SemiBold',
            sans-serif;
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
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            700 130px 'Poppins-Bold',
            sans-serif;
        position: absolute;
        left: 2173px;
        top: 1533px;
        width: 504px;
        height: 103px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._32 {
        color: rgba(255, 255, 255, 0.95);
        text-align: center;
        font:
            600 130px 'Poppins-SemiBold',
            sans-serif;
        position: absolute;
        left: 1924px;
        top: 1522px;
        width: 248px;
        height: 103px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
