export type * from './ws_types'
export type * from './types'
export { MatchState } from './types'
// export type {Match, Match_Results, Match_ElimInfo, MatchType} from "@prisma/client"

export enum MatchPeriod {
    PREMATCH = 'pre',
    AUTO = 'auto',
    PAUSE = 'pause',
    TELEOP = 'teleop',
    POSTMATCH = 'post'
}
