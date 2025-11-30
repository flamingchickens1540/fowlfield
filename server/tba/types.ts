export type TbaEventInfo = {
    first_code?: string | null
    playoff_type?: TbaPlayoffType
    webcasts?: { url: string }[]
    remap_teams: { [key: string]: string }
}

export type TbaAward = {
    type_enum?: TbaAwardType
    name_str: string
    team_key?: TbaTeamNumber
    awardee?: string
}

export enum TbaAwardType {
    CHAIRMANS = 0,
    WINNER = 1,
    FINALIST = 2,
    WOODIE_FLOWERS = 3,
    DEANS_LIST = 4,
    VOLUNTEER = 5,
    FOUNDERS = 6,
    BART_KAMEN_MEMORIAL = 7,
    MAKE_IT_LOUD = 8,
    ENGINEERING_INSPIRATION = 9,
    ROOKIE_ALL_STAR = 10,
    GRACIOUS_PROFESSIONALISM = 11,
    COOPERTITION = 12,
    JUDGES = 13,
    HIGHEST_ROOKIE_SEED = 14,
    ROOKIE_INSPIRATION = 15,
    INDUSTRIAL_DESIGN = 16,
    QUALITY = 17,
    SAFETY = 18,
    SPORTSMANSHIP = 19,
    CREATIVITY = 20,
    ENGINEERING_EXCELLENCE = 21,
    ENTREPRENEURSHIP = 22,
    EXCELLENCE_IN_DESIGN = 23,
    EXCELLENCE_IN_DESIGN_CAD = 24,
    EXCELLENCE_IN_DESIGN_ANIMATION = 25,
    DRIVING_TOMORROWS_TECHNOLOGY = 26,
    IMAGERY = 27,
    MEDIA_AND_TECHNOLOGY = 28,
    INNOVATION_IN_CONTROL = 29,
    SPIRIT = 30,
    WEBSITE = 31,
    VISUALIZATION = 32,
    AUTODESK_INVENTOR = 33,
    FUTURE_INNOVATOR = 34,
    RECOGNITION_OF_EXTRAORDINARY_SERVICE = 35,
    OUTSTANDING_CART = 36,
    WSU_AIM_HIGHER = 37,
    LEADERSHIP_IN_CONTROL = 38,
    NUM_1_SEED = 39,
    INCREDIBLE_PLAY = 40,
    PEOPLES_CHOICE_ANIMATION = 41,
    VISUALIZATION_RISING_STAR = 42,
    BEST_OFFENSIVE_ROUND = 43,
    BEST_PLAY_OF_THE_DAY = 44,
    FEATHERWEIGHT_IN_THE_FINALS = 45,
    MOST_PHOTOGENIC = 46,
    OUTSTANDING_DEFENSE = 47,
    POWER_TO_SIMPLIFY = 48,
    AGAINST_ALL_ODDS = 49,
    RISING_STAR = 50,
    CHAIRMANS_HONORABLE_MENTION = 51,
    CONTENT_COMMUNICATION_HONORABLE_MENTION = 52,
    TECHNICAL_EXECUTION_HONORABLE_MENTION = 53,
    REALIZATION = 54,
    REALIZATION_HONORABLE_MENTION = 55,
    DESIGN_YOUR_FUTURE = 56,
    DESIGN_YOUR_FUTURE_HONORABLE_MENTION = 57,
    SPECIAL_RECOGNITION_CHARACTER_ANIMATION = 58,
    HIGH_SCORE = 59,
    TEACHER_PIONEER = 60,
    BEST_CRAFTSMANSHIP = 61,
    BEST_DEFENSIVE_MATCH = 62,
    PLAY_OF_THE_DAY = 63,
    PROGRAMMING = 64,
    PROFESSIONALISM = 65,
    GOLDEN_CORNDOG = 66,
    MOST_IMPROVED_TEAM = 67,
    WILDCARD = 68,
    CHAIRMANS_FINALIST = 69,
    OTHER = 70,
    AUTONOMOUS = 71,
    INNOVATION_CHALLENGE_SEMI_FINALIST = 72,
    ROOKIE_GAME_CHANGER = 73,
    SKILLS_COMPETITION_WINNER = 74,
    SKILLS_COMPETITION_FINALIST = 75,
    ROOKIE_DESIGN = 76,
    ENGINEERING_DESIGN = 77,
    DESIGNERS = 78,
    CONCEPT = 79,
    GAME_DESIGN_CHALLENGE_WINNER = 80,
    GAME_DESIGN_CHALLENGE_FINALIST = 81,
    SUSTAINABILITY = 82
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

// https://github.com/the-blue-alliance/the-blue-alliance/blob/0ff5d0256e24bf340c37cf9e644a0e65c3d691ab/pwa/app/api/tba/read/types.gen.ts#L1800
export type TbaScoreBreakdown = {
  adjustPoints?: number;
  algaePoints?: number;
  autoBonusAchieved?: boolean;
  autoCoralCount?: number;
  autoCoralPoints?: number;
  autoLineRobot1?: 'No' | 'Yes';
  autoLineRobot2?: 'No' | 'Yes';
  autoLineRobot3?: 'No' | 'Yes';
  autoMobilityPoints?: number;
  autoPoints?: number;
  autoReef?: {
    topRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    midRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    botRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    trough: number;
    /**
     * Unofficial TBA-computed value that sums the total number of game pieces scored in the botRow object.
     */
    tba_botRowCount?: number;
    /**
     * Unofficial TBA-computed value that sums the total number of game pieces scored in the midRow object.
     */
    tba_midRowCount?: number;
    /**
     * Unofficial TBA-computed value that sums the total number of game pieces scored in the topRow object.
     */
    tba_topRowCount?: number;
  };
  bargeBonusAchieved?: boolean;
  coopertitionCriteriaMet?: boolean;
  coralBonusAchieved?: boolean;
  endGameBargePoints?: number;
  endGameRobot1?: 'None' | 'Parked' | 'ShallowCage' | 'DeepCage';
  endGameRobot2?: 'None' | 'Parked' | 'ShallowCage' | 'DeepCage';
  endGameRobot3?: 'None' | 'Parked' | 'ShallowCage' | 'DeepCage';
  foulCount?: number;
  foulPoints?: number;
  g206Penalty?: boolean;
  g410Penalty?: boolean;
  g418Penalty?: boolean;
  g428Penalty?: boolean;
  netAlgaeCount?: number;
  rp?: number;
  techFoulCount?: number;
  teleopCoralCount?: number;
  teleopCoralPoints?: number;
  teleopPoints?: number;
  teleopReef?: {
    topRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    midRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    botRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    trough: number;
    /**
     * Unofficial TBA-computed value that sums the total number of game pieces scored in the botRow object.
     */
    tba_botRowCount?: number;
    /**
     * Unofficial TBA-computed value that sums the total number of game pieces scored in the midRow object.
     */
    tba_midRowCount?: number;
    /**
     * Unofficial TBA-computed value that sums the total number of game pieces scored in the topRow object.
     */
    tba_topRowCount?: number;
  };
  totalPoints?: number;
  wallAlgaeCount?: number;
};