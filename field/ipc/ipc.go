package ipc

import (
	"encoding/json"
	"log"

	"github.com/zealic/go2node"
	"team1540.org/fowlfield/lib/field"
	"team1540.org/fowlfield/model"
)

type NodeIPC struct {
	channel    go2node.NodeChannel
	hasSentAck bool
}

var arena *field.Arena

func NewClient(field_arena *field.Arena) *NodeIPC {
	channel, err := go2node.RunAsNodeChild()
	arena = field_arena
	if err != nil {
		log.Println("could not create channel!")
		panic(err)
	}

	return &NodeIPC{
		channel,
		false,
	}
}

func (client *NodeIPC) LoadMessage(msg *go2node.NodeMessage) error {
	msgContents := new(model.IPCMessage)
	err := msg.Unmarshal(msgContents)
	if err != nil {
		log.Println("COULD NOT PARSE MSG", err, msg, msgContents)
	}
	processCommand(client, msgContents.Command, msgContents.Data)
	client.SendDsStatus(arena.GetAllianceStationStatuses())
	client.hasSentAck = false
	return err
}

func (client *NodeIPC) send(message model.IPCMessage) {
	bytes, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}
	client.channel.Write(&go2node.NodeMessage{
		Message: bytes,
	})
}

func (client *NodeIPC) SendDsStatus(statuses map[string]model.AllianceStationStatus) {
	client.send(model.IPCMessage{
		Command: "dsStatus",
		Data: model.IPCData{
			DsStatus: &statuses,
		},
	})
}

func (client *NodeIPC) SendUsageReport(team int, report string) {
	client.send(model.IPCMessage{
		Command: "usageReport",
		Data: model.IPCData{
			TeamId:      &team,
			UsageReport: &report,
		},
	})
}

func (client *NodeIPC) SendMatchHold(statuses map[string]model.AllianceStationStatus) {
	client.send(model.IPCMessage{
		Command: "matchhold",
		Data: model.IPCData{
			DsStatus: &statuses,
		},
	})
}

func (client *NodeIPC) SendMatchConfirm(statuses map[string]model.AllianceStationStatus) {
	client.send(model.IPCMessage{
		Command: "matchconfirm",
		Data: model.IPCData{
			DsStatus: &statuses,
		},
	})
}


func (client *NodeIPC) Loop() {
	msg, err := client.channel.Read()
	if err != nil {
		log.Println(err.Error())
	}
	client.LoadMessage(msg)
}
