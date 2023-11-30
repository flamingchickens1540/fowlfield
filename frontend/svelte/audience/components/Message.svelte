<!--suppress CommaExpressionJS -->
<script lang=ts>
    import {eventData} from "@store"

	import { onDestroy } from "svelte";
	import { derived } from "svelte/store";
	import { fade } from "svelte/transition";



    const time = derived(eventData, ($eventData) => {
            const date = new Date($eventData.lunchReturnTime)
            let hours = date.getHours() % 12
            if (hours == 0) {hours = 12}
            return hours+":"+date.getMinutes()+" "+(date.getHours() >= 12 ? "PM" : "AM")
    })
    let timer;

    onDestroy(() => clearInterval(timer))

    let timeRemaining = 0
    const timerCb = () => {
        timeRemaining = Math.ceil(($eventData.lunchReturnTime - Date.now())/1000/60/5)*5
        if (timeRemaining <= 0) {timeRemaining = 0}
    }

    $: $eventData, timerCb()
    timer = setInterval(timerCb, 15000)
</script>
<div class="on-screen-message" out:fade={{}} in:fade={{}}>
    <svg
    class="rectangle-6"
    width="1437"
    height="629"
    viewBox="0 0 1437 629"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path
    d="M0 -19H-19V0V629V648H0H1437H1456V629V0V-19H1437H0Z"
    fill="#5A5A5A"
    stroke="url(#paint0_linear_23_63)"
    stroke-width="38"
    />
    <defs>
        <linearGradient
        id="paint0_linear_23_63"
        x1="-249.23"
        y1="261.887"
        x2="1187.77"
        y2="261.887"
        gradientUnits="userSpaceOnUse"
        >
        <stop stop-color="#ED1C24" />
        <stop offset="1" stop-color="#0066B3" />
    </linearGradient>
</defs>
</svg>

<div class="header">At Lunch</div>

<div class="detail">Matches resume at {$time}</div>
<div class="detail-2">Returning {timeRemaining == 0 ? "soon" : `in ${timeRemaining} minutes`}</div>
</div>

<style lang=scss>
    .on-screen-message,
    .on-screen-message * {
        box-sizing: border-box;
    }
    .on-screen-message {
        background: #00ff00;
        width: 3840px;
        height: 2160px;
        top:0;
        bottom:0;
        left:0;
        right:0;
        position: absolute;
        overflow: hidden;
    }

    .rectangle-6 {
        position: absolute;
        left: 1201px;
        top: 766px;
        overflow: visible;
    }
    .header, .detail, .detail-2 {
        font-family: "Poppins", sans-serif;
        color: #ffffff;
        text-align: center;
        left: 1201px;
        width: 1437px;
        display: flex;
        align-items: center;
        justify-content: center;
        position:absolute
    }
    .header {
        font-size: 180px;
        font-weight: 700;
        top: 837px;
        height: 267px;
    }
    .detail {
        font-size: 70px;
        font-weight: 500;
        top: 1078px;
        height: 246px;
    }
    .detail-2 {
        font-size: 70px;
        font-weight: 500;
        top: 1278px;
    }
    
</style>