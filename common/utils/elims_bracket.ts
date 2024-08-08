import { Match } from '@prisma/client'

export type DoubleEliminationAlliance = 1|2|3|4

export type DoubleEliminationMatch = {
    isUpper:boolean,
    matchNumber: number;
    matchId: string;
    elimRound: number;
    elimGroup: number;
    elimInstance: number;
    winnerTo?:Readonly<{match:number, alliance:"red"|"blue"}>
    loserTo?:Readonly<{match:number, alliance:"red"|"blue"}>
};
export function getBracketInfo(match:Match):DoubleEliminationMatch|null {
    if (match.type == "qualification") {return null}
    return schedule[match.stage_index]
}

export const schedule: Readonly<{[key:number]:Readonly<DoubleEliminationMatch>}> = { // Makes thinking about the matches easier to avoid the index offset
    1:{
        isUpper: true,
        matchNumber: 1,
        matchId: "sf1m1",
        elimRound: 4,
        elimGroup: 1,
        elimInstance: 1,
        winnerTo:{match:3, alliance:"red"},
        loserTo:{match:4, alliance:"red"}
    },
    2:{
        isUpper: true,
        matchNumber: 2,
        matchId: "sf2m1",
        elimRound: 4,
        elimGroup: 2,
        elimInstance: 1,
        winnerTo:{match:3, alliance:"blue"},
        loserTo:{match:4, alliance:"blue"},
    },
    3:{
        isUpper: true,
        matchNumber: 3,
        matchId: "sf3m1",
        elimRound: 4,
        elimGroup: 3,
        elimInstance: 1,
        winnerTo:{match:6, alliance:"red"},
        loserTo:{match:5, alliance:"red"},
    },
    4:{
        isUpper: false,
        matchNumber: 4,
        matchId: "sf4m1",
        elimRound: 2,
        elimGroup: 4,
        elimInstance: 1,
        winnerTo:{match:5, alliance:"blue"},
    },
    5:{
        isUpper: false,
        matchNumber: 5,
        matchId: "sf5m1",
        elimRound: 2,
        elimGroup: 5,
        elimInstance: 1,
        winnerTo:{match:6, alliance:"blue"},
    },
    6:{
        isUpper: true,
        matchNumber: 6,
        matchId: "f1m1",
        elimRound: 1,
        elimGroup: 1,
        elimInstance: 1,
    },
    7:{
        isUpper: true,
        matchNumber: 7,
        matchId: "f1m2",
        elimRound: 1,
        elimGroup: 1,
        elimInstance: 2,
    },
    8:{
        isUpper: true,
        matchNumber: 8,
        matchId: "f1m3",
        elimRound: 1,
        elimGroup: 1,
        elimInstance: 3,
    },
};