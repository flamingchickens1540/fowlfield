package model

type IPCMessage struct {
	Command string `json:"cmd"`
	Data    any    `json:"data"`
}
