import { Match_State } from '@prisma/client'

export const statusColors: { [key in Match_State]: string } = {
    not_started: '#dc0000',
    in_progress: '#baba02',
    ended: '#0000ff',
    posted: '#009f22'
}

export const statusMessages: { [key in Match_State]: string } = {
    not_started: 'Pending',
    in_progress: 'In Progress',
    ended: 'Complete',
    posted: 'Posted'
}
