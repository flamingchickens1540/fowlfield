package model

type Team struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	RobotName   string `json:"robotname"`
	Description string `json:"description"`
}
