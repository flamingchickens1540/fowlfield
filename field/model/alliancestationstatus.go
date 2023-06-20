package model

type AllianceStationStatus struct {
	DsConnected    bool `json:"dsConnected"`
	RobotConnected bool `json:"robotConnected"`
}
