import { matchPeriod, matchTime } from '~/lib/store'
import { MatchPeriod } from '~common/types'
import { getElapsedTimeInPeriod } from '~common/utils/match_timer'
import { get } from 'svelte/store'
import socket from '~/lib/socket'

const match_end = new Audio('/assets/audio/match_end.wav')
const match_start = new Audio('/assets/audio/match_start.wav')
const match_teleop = new Audio('/assets/audio/match_teleop.wav')
const match_endgame = new Audio('/assets/audio/match_endgame.wav')
export default function configureAudio() {
    socket.on('playSound', async (sound) => {
        switch (sound) {
            case 'start':
                await match_start.play()
                break
            case 'teleop':
                await match_teleop.play()
                break
            case 'end':
                await match_end.play()
                break
            case 'abort':
                await match_end.play()
                break
        }
    })
    matchPeriod.subscribe((period) => {
        const match_time = get(matchTime)
        if (
            Math.abs(getElapsedTimeInPeriod(match_time) ?? 0) > 0.25 ||
            match_time == 0
        ) {
            console.log(
                getElapsedTimeInPeriod(match_time),
                'too late, not playing'
            )
            return
        }
        console.log('playing', period, 'sound')
        switch (period) {
            case MatchPeriod.AUTO:
                match_start.play()
                break
            // case MatchPeriod.PAUSE: match_end.play();break;
            case MatchPeriod.TELEOP:
                match_teleop.play()
                setTimeout(() => {
                    if (get(matchPeriod) == MatchPeriod.TELEOP) {
                        console.log('Playing endgame sound')
                        match_endgame.play()
                    }
                }, 120 * 1000)
                break
            case MatchPeriod.POSTMATCH:
                match_end.play()
                break
        }
    })
}
