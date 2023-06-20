package ipc

import (
	"fmt"

	"team1540.org/fowlfield/model"
)


func processCommand(message model.IPCMessage) {
	switch message.Command {
	case "load":
		loadMatch([]byte(message.Data))
	case "start":
		startMatch([]byte(message.Data))
	}
}

func loadMatch(jsonData []byte) {
	matchData, _ := model.LoadMatch(jsonData)
	fmt.Println(matchData)
	arena.LoadMatch(&matchData)
}

func startMatch(jsonData []byte) {
	matchData, _ := model.LoadMatch(jsonData)
	fmt.Println(matchData)
	if arena.CurrentMatch.Id != matchData.Id {
		panic("WRONG MATCH")
	}
	arena.StartMatch()
}
