<script lang=ts>
	import matchData, {dsStatuses} from "@store";
	import RobotMonitor from "./components/RobotMonitor.svelte";
    import {statusMessages} from "consts"
    const {id, state} = matchData
    $: isReady = Object.values($dsStatuses ?? {}).every((value) => value.bypassed || value.robotConnected)
</script>
<div id=teammonitorgrid>
    <div class=row>
        <div id="matchid" class=centered>Match: {$id}</div>
        <div id=matchstatus class=centered style="background-color:{isReady? "#9BBB59" : "#C0504E"}">{statusMessages[$state]} - {isReady ? "READY" : "NOT READY"}</div>
    </div>
    <div class=row>
    <div class=header>Station</div>
    <div class=header>Team</div>
    <div class=header>Pretty Team</div>
    <div class=header>DS</div>
    <div class=header>Radio</div>
    <div class=header>Rio</div>
    <div class=header>Battery</div>
    <div class=header>Status</div>
    <div class=header>Trip Time (ms)</div>
    <div class=header>Missed Packets</div>
    <div class=header>Estop</div>
    </div>
    <RobotMonitor row={3} DSKey="B1"></RobotMonitor>
    <RobotMonitor row={4} DSKey="B2"></RobotMonitor>
    <RobotMonitor row={5} DSKey="B3"></RobotMonitor>
    <RobotMonitor row={6} DSKey="R1"></RobotMonitor>
    <RobotMonitor row={7} DSKey="R2"></RobotMonitor>
    <RobotMonitor row={8} DSKey="R3"></RobotMonitor>
    
</div>


<style lang="scss">
    @import "./monitor.scss";
    #matchid {
        background-color: gray;
        grid-column: 1/span 2;
        font-size: 20px;
        font-weight:700;
        text-shadow:  1px 1px 5px rgb(199, 199, 199);
    }
    #matchstatus {
        grid-column: 3/span 9;
        font-size: 20px;
        font-weight:700;
        letter-spacing: 1px;
    }
</style>