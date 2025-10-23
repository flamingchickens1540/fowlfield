import { shuffleList } from '~common/utils'

class TeamQueue {
    waiting_teams: string[]

    new_match():
        | {
              red: [string, string, string]
              blue: [string, string, string]
          }
        | undefined {
        if (this.waiting_teams.length < 6) {
            return
        }
        shuffleList(this.waiting_teams)

        return {
            red: [this.waiting_teams.pop(), this.waiting_teams.pop(), this.waiting_teams.pop()],
            blue: [this.waiting_teams.pop(), this.waiting_teams.pop(), this.waiting_teams.pop()]
        }
    }

    queue_team(team: string) {
        this.waiting_teams.push(team)
    }

    remove_team(team: string) {
        const i = this.waiting_teams.indexOf(team)
        if (i == -1) {
            return
        }

        this.waiting_teams.splice(i)
    }
}
