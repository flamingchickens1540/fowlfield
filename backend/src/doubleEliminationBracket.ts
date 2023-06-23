export type DoubleEliminationAlliance = {
  seed: number;
  teams: number[];
};

export type DoubleEliminationMatch = {
  matchNumber: number;
  matchId: string;
  elimRound: number;
  elimGroup: number;
  elimInstance: number;
  red: DoubleEliminationAlliance | null;
  blue: DoubleEliminationAlliance | null;
};

export class DoubleEliminationBracket {
  private schedule: DoubleEliminationMatch[] = [
    {
      matchNumber: 1,
      matchId: "qf1m1",
      elimRound: 4,
      elimGroup: 1,
      elimInstance: 1,
      red: null,
      blue: null,
    },
    {
      matchNumber: 2,
      matchId: "qf2m1",
      elimRound: 4,
      elimGroup: 2,
      elimInstance: 1,
      red: null,
      blue: null,
    },
    {
      matchNumber: 3,
      matchId: "qf3m1",
      elimRound: 4,
      elimGroup: 3,
      elimInstance: 1,
      red: null,
      blue: null,
    },
    {
      matchNumber: 4,
      matchId: "sf1m1",
      elimRound: 2,
      elimGroup: 1,
      elimInstance: 1,
      red: null,
      blue: null,
    },
    {
      matchNumber: 5,
      matchId: "sf1m2",
      elimRound: 2,
      elimGroup: 2,
      elimInstance: 1,
      red: null,
      blue: null,
    },
    {
      matchNumber: 6,
      matchId: "f1m1",
      elimRound: 1,
      elimGroup: 1,
      elimInstance: 1,
      red: null,
      blue: null,
    },
    {
      matchNumber: 7,
      matchId: "f1m2",
      elimRound: 1,
      elimGroup: 1,
      elimInstance: 2,
      red: null,
      blue: null,
    },
    {
      matchNumber: 8,
      matchId: "f1m3",
      elimRound: 1,
      elimGroup: 1,
      elimInstance: 3,
      red: null,
      blue: null,
    },
  ];
  private alliances: DoubleEliminationAlliance[] = [
    {
      seed: 1,
      teams: [],
    },
    {
      seed: 2,
      teams: [],
    },
    {
      seed: 3,
      teams: [],
    },
    {
      seed: 4,
      teams: [],
    },
  ];
  private scheduleIndex = 0;
  private netFinalWins = 0;

  constructor(
    seed1: number[],
    seed2: number[],
    seed3: number[],
    seed4: number[]
  ) {
    if (
      seed1.length >= 3 ||
      seed2.length >= 3 ||
      seed3.length >= 3 ||
      seed4.length >= 3
    )
      throw new Error("All alliances must have at least 3 teams");

    this.alliances[0].teams = seed1;
    this.alliances[1].teams = seed2;
    this.alliances[2].teams = seed3;
    this.alliances[3].teams = seed4;

    this.schedule[0].red = this.alliances[0];
    this.schedule[0].blue = this.alliances[3];
    this.schedule[1].red = this.alliances[1];
    this.schedule[1].blue = this.alliances[2];
  }

  update(matchNumber: number, winner: "red" | "blue") {
    //the logic to make double elimination work
    switch (matchNumber - 1) {
      case 0: {
        this.schedule[3].red =
          winner === "red"
            ? this.schedule[matchNumber - 1].red
            : this.schedule[matchNumber - 1].blue;
        this.schedule[2].red =
          winner === "blue"
            ? this.schedule[matchNumber - 1].red
            : this.schedule[matchNumber - 1].blue;
      }
      case 1: {
        this.schedule[3].blue =
          winner === "red"
            ? this.schedule[matchNumber - 1].red
            : this.schedule[matchNumber - 1].blue;
        this.schedule[2].blue =
          winner === "blue"
            ? this.schedule[matchNumber - 1].red
            : this.schedule[matchNumber - 1].blue;
      }
      case 2: {
        this.schedule[4].blue =
          winner === "blue"
            ? this.schedule[matchNumber - 1].red
            : this.schedule[matchNumber - 1].blue;
      }
      case 3: {
        this.schedule[5].red =
          winner === "red"
            ? this.schedule[matchNumber - 1].red
            : this.schedule[matchNumber - 1].blue;
        this.schedule[4].red =
          winner === "blue"
            ? this.schedule[matchNumber - 1].red
            : this.schedule[matchNumber - 1].blue;
      }
      case 4: {
        this.schedule[5].blue =
          winner === "red"
            ? this.schedule[matchNumber - 1].red
            : this.schedule[matchNumber - 1].blue;
      }
      case 5: {
        //finals 1
        this.schedule[6].red = this.schedule[matchNumber - 1].red;
        this.schedule[6].blue = this.schedule[matchNumber - 1].blue;
        this.netFinalWins += winner === "red" ? 1 : -1;
      }
      case 6: {
        //finals 2
        this.schedule[6].red = this.schedule[matchNumber - 1].red;
        this.schedule[6].blue = this.schedule[matchNumber - 1].blue;
        this.netFinalWins += winner === "red" ? 1 : -1;
      }
      case 7:
        {
          //finals 3
          this.schedule[6].red = this.schedule[matchNumber - 1].red;
          this.schedule[6].blue = this.schedule[matchNumber - 1].blue;
        }

        this.scheduleIndex++;
    }
  }

  getNextMatch(): DoubleEliminationMatch {
    if (
      this.scheduleIndex >= this.schedule.length ||
      (this.scheduleIndex == 6 && this.netFinalWins != 0)
    )
      throw new Error("Bracket is over");

    if (
      this.schedule[this.scheduleIndex].red == null ||
      this.schedule[this.scheduleIndex].blue == null
    )
      throw new Error("Must update before requesting next match");

    return this.schedule[this.scheduleIndex];
  }

  getCurrentMatch() {
    return this.schedule[this.scheduleIndex];
  }
}
