import { MatchState } from '~common/types'

export const statusColors: { [key in MatchState]: string } = {
    [MatchState.PENDING]: '#dc0000',
    [MatchState.IN_PROGRESS]: '#baba02',
    [MatchState.COMPLETE]: '#0000ff',
    [MatchState.POSTED]: '#009f22'
}

export const statusMessages: { [key in MatchState]: string } = {
    [MatchState.PENDING]: 'Pending',
    [MatchState.IN_PROGRESS]: 'In Progress',
    [MatchState.COMPLETE]: 'Complete',
    [MatchState.POSTED]: 'Posted'
}
