import {matchPeriod, matchTime} from "@store"
import { MatchPeriod } from "@fowltypes";
import { getElapsedTimeInPeriod } from "@fowlutils/match_timer"
import { get } from "svelte/store";
import socket from "@socket";
const match_end = new Audio("/assets/audio/match_end.wav");
const match_start = new Audio("/assets/audio/match_start.wav");
const match_teleop = new Audio("/assets/audio/match_teleop.wav");

export default function configureAudio() {
    socket.on("abortMatch", () => {match_end.play()})
    matchPeriod.subscribe((period) => {
        const match_time = get(matchTime)
        if (Math.abs(getElapsedTimeInPeriod(match_time)) > 0.25 || match_time == 0) {console.log(getElapsedTimeInPeriod(match_time), "too late, not playing"); return}
        console.log("playing", period, "sound")
        switch (period) {
            case MatchPeriod.AUTO: match_start.play();break;
            case MatchPeriod.PAUSE: match_end.play();break;
            case MatchPeriod.TELEOP: match_teleop.play();break;
            case MatchPeriod.POSTMATCH: match_end.play();break;
        }
    })
}