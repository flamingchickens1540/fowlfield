package ipc

import (
	"log"

	"team1540.org/fowlfield/model"
)

func processCommand(client *NodeIPC, cmd string, message model.IPCData) {
	switch cmd {
	case "abort":
		arena.AbortMatch()
	case "load":
		loadMatch(*message.Match)
	case "start":
		startMatch(client, *message.Match)
	}
}

func loadMatch(match model.Match) {
	log.Println("loading", match.Id)
	arena.LoadMatch(&match)
}

func startMatch(client *NodeIPC, match model.Match) {
	log.Println("starting", match.Id)
	arena.LoadMatch(&match)
	if arena.CheckCanStartMatch() == nil {
		client.SendMatchConfirm(arena.GetAllianceStationStatuses())
		arena.StartMatch()
	} else {
		client.SendMatchHold(arena.GetAllianceStationStatuses())
	}

}
