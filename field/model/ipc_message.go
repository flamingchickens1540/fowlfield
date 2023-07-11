package model

type IPCMessage struct {
	Command string  `json:"cmd"`
	Data    IPCData `json:"data"`
}

type IPCData struct {
	Match           *Match                            `json:"match"`
	TeamId          *int                              `json:"teamId"`
	UsageReport     *string                           `json:"usageReport"`
	AllianceStation *string                           `json:"alliancestation" tstype:"DriverStation"`
	DsStatus        *map[string]AllianceStationStatus `json:"ds_status" tstype:"{ [key in DriverStation]: AllianceStationStatus}"`
}
