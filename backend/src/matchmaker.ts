import { MatchState } from "@fowltypes";
import { DoubleEliminationBracket } from "./doubleEliminationBracket";
import { getMatches } from "./models/db";
import { DBMatch } from "./models/matches";

export class MatchMaker {
  private currentMatch: DBMatch | null = null;
  private matches: { [key: string]: DBMatch } = {};
  private bracket: DoubleEliminationBracket | null = null;
  private matchNum = 0;

  constructor() {
    getMatches().then((matches) => {
      this.matches = matches;
    });

    Object.values(this.matches)
      .filter((match) => match.type == "qualification")
      .forEach((qualsmatch) => {
        if (qualsmatch.matchNumber > this.matchNum) {
          this.matchNum = qualsmatch.matchNumber;
        }
      });

    let elimMatches = Object.values(this.matches).filter(
      (match) => match.type == "elimination"
    );
    if (elimMatches.length == 0) return;

    let alliances: Set<number[]> = new Set();

    elimMatches.forEach((elimsmatch) => {
      alliances.add([elimsmatch.red1, elimsmatch.red2, elimsmatch.red3]);
    });

    this.initElims(
      Array.from(alliances)[0],
      Array.from(alliances)[1],
      Array.from(alliances)[2],
      Array.from(alliances)[3]
    );

    elimMatches.forEach((match) => {
      this.bracket!.update(
        match.matchNumber,
        match.redScore > match.blueScore ? "red" : "blue"
      );
    });
  }

  advanceQualsMatch(): DBMatch {
    this.matchNum++;

    this.currentMatch = new DBMatch({
      id: `QM${this.matchNum}`,
      matchNumber: this.matchNum,
      elimRound: 0,
      elimGroup: 0,
      elimInstance: 0,
      type: "qualification",
      red1: 0,
      red2: 0,
      red3: 0,
      blue1: 0,
      blue2: 0,
      blue3: 0,
      redScore: 0,
      blueScore: 0,
      startTime: 0,
      redAlliance:0,
      blueAlliance:0,
      state:MatchState.PENDING
    });

    return this.currentMatch;
  }

  async advanceElimMatch(): Promise<DBMatch> {
    if (this.bracket == null)
      throw new Error("Must initialize elims before advancing");

    let match = this.bracket.getNextMatch();

    this.currentMatch = new DBMatch({
      id: match.matchId,
      matchNumber: match.matchNumber,
      elimRound: match.elimRound,
      elimGroup: match.elimGroup,
      elimInstance: match.elimInstance,
      type: "elimination",
      red1: match!.red![0],
      red2: match!.red![1],
      red3: match!.red![2],
      blue1: match!.blue![0],
      blue2: match!.blue![1],
      blue3: match!.blue![2],
      redScore: 0,
      blueScore: 0,
      startTime: 0,
      redAlliance:0,
      blueAlliance:0,
      state:MatchState.PENDING
    });

    return this.currentMatch;
  }

  getCurrentMatch(): DBMatch | null {
    return this.currentMatch;
  }

  getAllMatches(): { [key: string]: DBMatch } {
    return this.matches;
  }

  initElims(
    seed1: number[],
    seed2: number[],
    seed3: number[],
    seed4: number[]
  ) {
    this.bracket = new DoubleEliminationBracket(seed1, seed2, seed3, seed4);
  }

  /**
   *
   * @param match
   * @warning MATCH CANNOT END IN A TIE
   */
  update(match: DBMatch) {
    this.matches[match.id] = match;

    if ((match.type = "elimination")) {
      this.bracket?.update(
        match.matchNumber,
        match.redScore > match.blueScore ? "red" : "blue"
      );
    }
  }
}
