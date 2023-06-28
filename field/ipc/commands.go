package ipc

import (
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
	log.Println("loading", match.Id)
	arena.LoadMatch(&match)
}

func startMatch(match model.Match) {
	log.Println("starting", match.Id)
	arena.LoadMatch(&match)
	log.Println(arena.StartMatch())
}
