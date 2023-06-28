<script lang=ts>
	import matchData, { teamList } from "@store";
	import RobotMonitor from "./components/RobotMonitor.svelte";

    
</script>

<div id=teammonitorgrid>
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
    </div>
    <RobotMonitor row={2} DSKey="B1" teamID={matchData.blue1}></RobotMonitor>
    <RobotMonitor row={3} DSKey="B2" teamID={matchData.blue2}></RobotMonitor>
    <RobotMonitor row={4} DSKey="B3" teamID={matchData.blue3}></RobotMonitor>
    <RobotMonitor row={5} DSKey="R1" teamID={matchData.red1}></RobotMonitor>
    <RobotMonitor row={6} DSKey="R2" teamID={matchData.red2}></RobotMonitor>
    <RobotMonitor row={7} DSKey="R3" teamID={matchData.red3}></RobotMonitor>
    
</div>


<style lang="scss">
    @import "./monitor.scss";
</style>