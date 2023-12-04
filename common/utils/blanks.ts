import type {ScoreBreakdown} from "@fowltypes";

export function getBlankScoreBreakdown():ScoreBreakdown {
    return {autoBunnyCount:0, autoTaxiBonus:[false,false,false], finalBunnyCount:0, targetHits:[0,0,0], endgameParkBonus:[false,false,false], fouls:[]}
}