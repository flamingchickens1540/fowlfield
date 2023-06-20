package ipc

import (
	"encoding/json"
	"fmt"

	"team1540.org/fowlfield/model"
)

func processCommand(cmd string, message []byte) {
	switch cmd {
	case "load":
		loadMatch(parseMatch(message))
	case "start":
		startMatch(parseMatch(message))
	}
}

func parseMatch(message []byte) model.Match {
	msgData := &struct {
		Data model.Match `json:"data"`
	}{}
	// matchData, _ := model.LoadMatch(jsonData)
	json.Unmarshal(message, msgData)
	return msgData.Data
}

func loadMatch(match model.Match) {
	fmt.Println(match)
	arena.LoadMatch(&match)
}

func startMatch(match model.Match) {
	fmt.Println(match)
	if arena.CurrentMatch.Id != match.Id {
		panic("WRONG MATCH")
	}
	arena.StartMatch()
}
