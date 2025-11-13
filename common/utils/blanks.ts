import { Match, Match_AllianceResults, Match_Results, Team } from '@prisma/client'
import { EventInfo } from '../types'

export function getBlankAllianceScoreBreakdown(): Match_AllianceResults {
    return {
        card_robot1: 'none',
        card_robot2: 'none',
        card_robot3: 'none',
        feeding_station_auto: 0,
        feeding_station_tele: 0,
        grass_auto: 0,
        grass_tele: 0,
        endgame_bunnies: 0,
        total_hits: 0,
        auto_park_robot1: false,
        auto_park_robot2: false,
        auto_park_robot3: false,
        foul_points: 0
    }
}

export function getBlankMatchScoreBreakdown(): Match_Results {
    return {
        cabbages_in_patch: false,
        red: getBlankAllianceScoreBreakdown(),
        blue: getBlankAllianceScoreBreakdown()
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
        scores: getBlankMatchScoreBreakdown(),
        type: 'qualification',
        red1: 0,
        red2: 0,
        red3: 0,
        blue1: 0,
        blue2: 0,
        blue3: 0
    }
}
