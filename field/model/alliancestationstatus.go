package model

type AllianceStationStatus struct {
	DsConnected    bool    `json:"dsConnected"`
	RadioConnected bool    `json:"radioConnected"`
	RobotConnected bool    `json:"robotConnected"`
	Enabled        bool    `json:"enabled"`
	IsAuto         bool    `json:"isAuto"`
	TripTime       int     `json:"tripTime"`
	MissedPackets  int     `json:"missedPackets"`
	Bypassed       bool    `json:"bypassed"`
	BatteryVoltage float64 `json:"battery"`
	IsEstopped     bool    `json:"isEstopped"`
}
