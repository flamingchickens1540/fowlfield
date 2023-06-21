package model

type IPCMessage struct {
	Command string  `json:"cmd"`
	Data    IPCData `json:"data"`
}

type IPCData struct {
	Match    *Match                            `json:"match"`
	Matches  *[]Match                          `json:"matches"`
	Team     *Team                             `json:"team"`
	Teams    *[]Team                           `json:"teams"`
	DsStatus *map[string]AllianceStationStatus `json:"ds_status" tstype:"{ [key in DriverStation]: AllianceStationStatus}"`
}
