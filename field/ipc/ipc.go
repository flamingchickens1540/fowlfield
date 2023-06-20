package ipc

import (
	"encoding/json"
	"fmt"

	"github.com/zealic/go2node"
	"team1540.org/fowlfield/lib/field"
	"team1540.org/fowlfield/model"
)

type NodeIPC struct {
	channel               go2node.NodeChannel
	latestMessage         *go2node.NodeMessage
	latestMessageContents *model.IPCMessage
	hasSentAck            bool
}

var arena *field.Arena

func NewClient(field_arena *field.Arena) *NodeIPC {
	channel, err := go2node.RunAsNodeChild()
	arena = field_arena
	if err != nil {
		fmt.Println("could not create channel!")
		panic(err)
	}

	return &NodeIPC{
		channel,
		nil,
		&model.IPCMessage{},
		false,
	}
}

func (client *NodeIPC) LoadMessage(msg *go2node.NodeMessage) error {
	client.latestMessage = msg
	err := msg.Unmarshal(client.latestMessageContents)
	if err != nil {
		fmt.Println("COULD NOT PARSE MSG", err, client.latestMessage, client.latestMessageContents)
	}

	processCommand(*client.latestMessageContents)
	client.hasSentAck = false
	return err
}

func (client *NodeIPC) send(signal string, data any) {
	dataJson, err := json.Marshal(data)
	if err != nil {
		fmt.Println(err)
	}
	bytes, err := json.Marshal(model.IPCMessage{
		Command: signal,
		Data:    string(dataJson),
	})
	if err != nil {
		fmt.Println(err)
	}
	client.channel.Write(&go2node.NodeMessage{
		Message: bytes,
	})
}

func (client *NodeIPC) SendDsStatus(statuses map[string]model.AllianceStationStatus) {
	client.send("dsStatus", statuses)
}

func (client *NodeIPC) Loop() {
	msg, err := client.channel.Read()
	if err != nil {
		fmt.Println(err.Error())
	}
	client.LoadMessage(msg)
}
