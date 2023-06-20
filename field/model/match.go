package model

import (
	"encoding/json"
	"fmt"
)

type Match struct {
	Id           string `json:"id"`
	MatchNumber  int    `json:"matchNumber"`
	ElimRound    int    `json:"elimRound"`
	ElimGroup    int    `json:"elimGroup"`
	ElimInstance int    `json:"elimInstance"`
	Type         string `json:"type" tstype:"'qualification'|'elimination'"`
	Red1         int    `json:"red1"`
	Red2         int    `json:"red2"`
	Red3         int    `json:"red3"`
	Blue1        int    `json:"blue1"`
	Blue2        int    `json:"blue2"`
	Blue3        int    `json:"blue3"`
}

func LoadMatch(jsonBlob []byte) (Match, error) {
	var match Match
	err := json.Unmarshal(jsonBlob, &match)
	if err != nil {
		fmt.Println("error:", err)
	}
	return match, err
}
