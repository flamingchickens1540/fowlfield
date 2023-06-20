package model

type IPCMessage struct {
	Command string `json:"cmd"`
	Data    string `json:"data"`
}
