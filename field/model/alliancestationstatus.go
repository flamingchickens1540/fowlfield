package model

type AllianceStationStatus struct {
	DsConnected     bool    `json:"dsConnected"`
	RadioConnected  bool    `json:"radioConnected"`
	RobotConnected  bool    `json:"robotConnected"`
	Enabled         bool    `json:"enabled"`
	IsAuto          bool    `json:"isAuto"`
	IsTempStopped   bool    `json:"isTempStopped"`
	TripTime        int     `json:"tripTime"`
	MissedPackets   int     `json:"missedPackets"`
	Bypassed        bool    `json:"bypassed"`
	BatteryVoltage  float64 `json:"battery"`
	IsEstopped      bool    `json:"isEstopped"`
	IsEstopAssigned bool    `json:"estopActive"`
	TeamNumber      int     `json:"assignedTeam"`
}
