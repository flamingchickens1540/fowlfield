import { EventInfo } from '~common/types'

export interface EventState extends EventInfo {
    loadedMatch: string
    preloadedMatch: string
}

export const eventState: EventState = {
    loadedMatch: '',
    preloadedMatch: '',
    atLunch: false,
    lunchReturnTime: 0
}
