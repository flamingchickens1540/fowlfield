export type TbaEventInfo = {
    first_code?: string | null
    playoff_type?: TbaPlayoffType
    webcasts?: { url: string }[]
    remap_teams: { [key: string]: string }
}
export type DisplayNumber =
    | number
    | `${number}${'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L' | 'M' | 'N' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | ''}`
export type TbaTeamNumber = `frc${DisplayNumber}`
export interface TbaMatch {
    comp_level: 'qm' | 'ef' | 'qf' | 'sf' | 'f'
    set_number: number
    match_number: number
    alliances: { [key in 'red' | 'blue']: TbaAlliance }
    score_breakdown?: { [key in 'red' | 'blue']: Partial<TbaScoreBreakdown> }
    time_string?: string
    time_utc?: string
    display_name?: string
}

export type TbaScoreBreakdown = {
    adjustPoints: number
    autoAmpNoteCount: number
    autoAmpNotePoints: number
    autoLeavePoints: number
    autoLineRobot1: 'Yes' | 'No'
    autoLineRobot2: 'Yes' | 'No'
    autoLineRobot3: 'Yes' | 'No'
    autoPoints: number
    autoSpeakerNoteCount: number
    autoSpeakerNotePoints: number
    autoTotalNotePoints: number
    coopNotePlayed: boolean
    coopertitionCriteriaMet: boolean
    endGameHarmonyPoints: number
    endGameNoteInTrapPoints: number
    endGameOnStagePoints: number
    endGameParkPoints: number
    endGameRobot1: never //I don't know what the valid values are here and I don't to look
    endGameRobot2: never
    endGameRobot3: never
    endGameSpotLightBonusPoints: number
    endGameTotalStagePoints: number
    ensembleBonusAchieved: boolean
    ensembleBonusOnStageRobotsThreshold: number
    ensembleBonusStagePointsThreshold: number
    foulCount: number
    foulPoints: number
    g206Penalty: boolean
    g408Penalty: boolean
    g424Penalty: boolean
    melodyBonusAchieved: boolean
    melodyBonusThreshold: number
    melodyBonusThresholdCoop: number
    melodyBonusThresholdNonCoop: number
    micCenterStage: boolean
    micStageLeft: boolean
    micStageRight: boolean
    rp: number
    techFoulCount: number
    teleopAmpNoteCount: number
    teleopAmpNotePoints: number
    teleopPoints: number
    teleopSpeakerNoteAmplifiedCount: number
    teleopSpeakerNoteAmplifiedPoints: number
    teleopSpeakerNoteCount: number
    teleopSpeakerNotePoints: number
    teleopTotalNotePoints: number
    totalPoints: number
    trapCenterStage: boolean
    trapStageLeft: boolean
    trapStageRight: boolean
}

export class TbaAlliance {
    teams: TbaTeamNumber[] = []
    surrogates: TbaTeamNumber[] = []
    dqs: string[] = []
    score?: number

    constructor(team1: number, team2: number, team3: number, redcard1: boolean, redcard2: boolean, redcard3: boolean, score?: number) {
        const sets: [number, boolean][] = [
            [team1, redcard1],
            [team2, redcard2],
            [team3, redcard3]
        ]
        for (const [team, redcard] of sets) {
            const tbateam: TbaTeamNumber = `frc${team}`
            if (team != 0) {
                this.teams.push(tbateam)
                if (redcard) {
                    this.dqs.push(tbateam)
                }
            }
        }
        this.score = score
    }
}
export type TbaPlayoffAlliances = TbaTeamNumber[][]
export interface TbaRanking {
    team_key: TbaTeamNumber
    rank: number
    wins: number
    losses: number
    ties: number
    dqs: number
    played: number
}

export interface TbaRankings {
    breakdowns: string[]
    rankings: TbaRanking[]
}

export enum TbaPlayoffType {
    // Standard Brackets
    BRACKET_16_TEAM = 1,
    BRACKET_8_TEAM = 0,
    BRACKET_4_TEAM = 2,
    BRACKET_2_TEAM = 9,

    // 2015 is special
    AVG_SCORE_8_TEAM = 3,

    // Round Robin
    ROUND_ROBIN_6_TEAM = 4,

    // Double Elimination Bracket
    // The legacy style is just a basic internet bracket
    // https://www.printyourbrackets.com/fillable-brackets/8-seeded-double-fillable.pdf
    LEGACY_DOUBLE_ELIM_8_TEAM = 5,
    // The "regular" style is the one that FIRST plans to trial for the 2023 season
    // https://www.firstinspires.org/robotics/frc/blog/2022-timeout-and-playoff-tournament-updates
    DOUBLE_ELIM_8_TEAM = 10,
    // The bracket used for districts with four divisions
    DOUBLE_ELIM_4_TEAM = 11,

    // Festival of Champions
    BO5_FINALS = 6,
    BO3_FINALS = 7,

    // Custom
    CUSTOM = 8
}
