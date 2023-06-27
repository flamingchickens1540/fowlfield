package ipc

import (
	"fmt"
	"log"

	"team1540.org/fowlfield/model"
)

func processCommand(cmd string, message model.IPCData) {
	switch cmd {
	case "abort":
		arena.AbortMatch()
	case "load":
		loadMatch(*message.Match)
	case "start":
		startMatch(*message.Match)
	}
}

func loadMatch(match model.Match) {
	fmt.Println("LOADING", match)
	arena.LoadMatch(&match)
}

func startMatch(match model.Match) {
	fmt.Println(match)
	arena.LoadMatch(&match)
	if arena.CurrentMatch.Id != match.Id {
		panic("WRONG MATCH")
	}
	log.Println(arena.StartMatch())

}
