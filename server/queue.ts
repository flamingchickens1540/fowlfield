import { assert } from "node:console";
import { shuffleList, sum } from "~common/utils";
import { TopQueue } from "~common/utils/top_queue";

const HEURISTIC_ITERATION_COUNT = 10;

type Alliance = [string, string, string];

type MatchCandidate = {
	red: Alliance;
	blue: Alliance;
};

// TODO
// - Create a heuristic for each match
//  - Number of each matches played
//  - Number of matches played against each other team
class TeamQueue {
	waiting_teams: string[] = [];
	// Maps the team key to the index in played_matrix
	team_map: Map<string, number> = new Map();
	played_matrix: [number, number][][] = [];

	generate_random_match(): MatchCandidate {
		shuffleList(this.waiting_teams);

		return {
			red: [
				this.waiting_teams.pop()!,
				this.waiting_teams.pop()!,
				this.waiting_teams.pop()!,
			],
			blue: [
				this.waiting_teams.pop()!,
				this.waiting_teams.pop()!,
				this.waiting_teams.pop()!,
			],
		};
	}

	/*
	 * Returns an array representing wow many times each team in the match has played in total throughout the event
	 * For considering which matches are better, lower scores are preferred
	 */
	has_played_scores(match: MatchCandidate): [string, number][] {
		const has_played_score = (alliance: Alliance) =>
			alliance.map((team1) => {
				const key = this.team_map.get(team1)!;
				return [team1, this.played_matrix[key][key][0]] as [string, number];
			});

		return [...has_played_score(match.red), ...has_played_score(match.blue)];
	}

	/*
	 * Returns an array representing the number of times each team has played with each other team on its own alliance
	 * For considering which matches are better, lower scores are preferred
	 */
	played_together_scores(match: MatchCandidate): [string, number][] {
		const count_together_scores = (alliance: Alliance) =>
			alliance.map(
				(team1) =>
					[
						team1,
						alliance
							.map((team2) => {
								const team1_key = this.team_map.get(team1)!;
								const team2_key = this.team_map.get(team2)!;

								return this.played_matrix[team1_key][team2_key][0];
							})
							.reduce((acc, val) => acc + val),
					] as [string, number],
			);

		let red = count_together_scores(match.red);
		let blue = count_together_scores(match.blue);

		return [...blue, ...red];
	}

	/*
	 * Returns the sum of how many times each team has played with each other team on its own alliance
	 * For considering which matches are better, lower scores are preferred
	 */
	played_against_scores(match: MatchCandidate): [string, number][] {
		const count_against_scores = (alliance: Alliance, other: Alliance) =>
			alliance.map(
				(team1) =>
					[
						team1,
						other
							.map((team2) => {
								const team1_key = this.team_map.get(team1)!;
								const team2_key = this.team_map.get(team2)!;

								return this.played_matrix[team1_key][team2_key][1];
							})
							.reduce((acc, val) => acc + val),
					] as [string, number],
			);

		const red = count_against_scores(match.red, match.blue);
		const blue = count_against_scores(match.blue, match.red);

		return [...blue, ...red];
	}

	compare_matches(one: MatchCandidate, two: MatchCandidate): number {
		return this.match_score(one) - this.match_score(two);
	}

	match_score(match: MatchCandidate): number {
		return sum(
			[
				this.has_played_scores(match).map(([_team, score]) => score),
				this.played_together_scores(match).map(([_team, score]) => score),
				this.played_against_scores(match).map(([_team, score]) => score),
			].flat(),
		);
	}

	find_worst_team(match: MatchCandidate): string {
		const played_against_scores = this.played_against_scores(match);
		const played_together_scores = this.played_together_scores(match);
		assert(played_against_scores.length == played_together_scores.length);

		let worst = 0;
		let worst_team;

		for (let i = 0; i < played_against_scores.length; i++) {
			const [team, against] = played_against_scores[i];
			const [_, together] = played_together_scores[i];

			const total = against + together;
			if (total > worst) {
				worst_team = team;
			}
		}

		return worst_team!;
	} // returns the index

	adjust_match(match: MatchCandidate): MatchCandidate | undefined {
		let cloned_match = JSON.parse(JSON.stringify(match)) as MatchCandidate;
		const worst_team = this.find_worst_team(cloned_match);

		// Remove the worst team
		const new_team = this.waiting_teams.pop()!;
		if (new_team == undefined) {
			// We have no other options for matches here
			return;
		}

		const red_i = cloned_match.red.indexOf(worst_team);
		if (red_i != -1) {
			// The order here shouldn't matter since we're only removing one element and pushing, not inserting
			cloned_match.red.push(new_team);

			const [removed_team] = cloned_match.red.splice(red_i, 1);
			this.waiting_teams.push(removed_team);
		} else {
			const blue_i = cloned_match.blue.indexOf(worst_team);
			if (blue_i == -1) {
				cloned_match.blue.push(new_team);

				const [removed_team] = cloned_match.blue.splice(red_i, 1);
				this.waiting_teams.push(removed_team);
			}
			cloned_match.blue.splice(blue_i, 1);
		}

		return cloned_match;
	}

	determine_best_match(): MatchCandidate {
		const initial = this.generate_random_match();
		const matches = new TopQueue([initial], this.compare_matches);

		for (let i = 0; i < HEURISTIC_ITERATION_COUNT; i++) {
			const new_match = this.adjust_match(matches.top);
			if (new_match == undefined) {
				break;
			}
			matches.push(new_match);
		}

		return matches.top;
	}

	new_match(): MatchCandidate | undefined {
		if (this.waiting_teams.length < 6) {
			return;
		}

		let teams = this.generate_random_match();
		return teams;
	}

	queue_team(team: string) {
		this.waiting_teams.push(team);
	}

	remove_team(team: string) {
		const i = this.waiting_teams.indexOf(team);
		if (i == -1) {
			return;
		}

		this.waiting_teams.splice(i);
	}
}
