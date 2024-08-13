import { Match, Match_AllianceResults, Team } from '@prisma/client'
import { EventInfo } from '../types'

export function getBlankScoreBreakdown(): Match_AllianceResults {
    return {
        card_robot1: 'none',
        card_robot2: 'none',
        card_robot3: 'none',
        auto_bunnies: 0,
        final_bunnies: 0,
        auto_taxi_bonus_robot1: false,
        auto_taxi_bonus_robot2: false,
        auto_taxi_bonus_robot3: false,
        endgame_park_bonus_robot1: false,
        endgame_park_bonus_robot2: false,
        endgame_park_bonus_robot3: false,
        target_hits_robot1: 0,
        target_hits_robot2: 0,
        target_hits_robot3: 0,
        fouls: []
    }
}
export function getBlankTeam(): Required<Team> {
    return {
        id: 0,
        display_number: '',
        team_name: '',
        robot_name: '',
        has_card: false
    }
}

export function getBlankEvent(): Required<EventInfo> {
    return {
        lunchReturnTime: 0,
        atLunch: false
    }
}
export function getBlankMatch(): Required<Match> {
    return {
        id: '',
        stage_index: 0,
        elim_info: {
            group: 0,
            instance: 0,
            round: 0,
            blue_alliance: 0,
            red_alliance: 0
        },
        startTime: 0,
        state: 'not_started',
        red_scores: getBlankScoreBreakdown(),
        blue_scores: getBlankScoreBreakdown(),
        type: 'qualification',
        red1: 0,
        red2: 0,
        red3: 0,
        blue1: 0,
        blue2: 0,
        blue3: 0
    }
}
