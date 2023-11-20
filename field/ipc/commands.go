package ipc

import (
	"log"

	"team1540.org/fowlfield/model"
)

func processCommand(client *NodeIPC, cmd string, message model.IPCData) {
	switch cmd {
	case "estop": 
		setEstop(client, *message.AllianceStation, true)
	case "abort":
		arena.AbortMatch()
	case "load":
		loadMatch(*message.Match)
	case "start":
		startMatch(client, *message.Match)
	case "unestop":
		setEstop(client, *message.AllianceStation, false)
	case "disableTemp":
		setTstop(client, *message.AllianceStation, true)
	case "enableTemp":
		setTstop(client, *message.AllianceStation, false)
	}

}

func loadMatch(match model.Match) {
	log.Println("loading", match.Id)
	arena.LoadMatch(&match)
}

func setEstop(client *NodeIPC, station string, estopped bool) {
	arena.HandleEstop(station, estopped)
	client.SendDsStatus(arena.GetAllianceStationStatuses())
}
func setTstop(client *NodeIPC, station string, stopped bool) {
	arena.HandleTemporaryStop(station, stopped)
	client.SendDsStatus(arena.GetAllianceStationStatuses())
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
