package model

type IPCMessage struct {
	Command string  `json:"cmd"`
	Data    IPCData `json:"data"`
}

type IPCData struct {
	Match           *Match                            `json:"match"`
	AllianceStation *string                           `json:"alliancestation" tstype:"DriverStation"`
	DsStatus        *map[string]AllianceStationStatus `json:"ds_status" tstype:"{ [key in DriverStation]: AllianceStationStatus}"`
}
