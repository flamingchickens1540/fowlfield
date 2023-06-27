package main

import (
	"fmt"
	"time"

	"team1540.org/fowlfield/ipc"
	"team1540.org/fowlfield/lib/field"
)

var client *ipc.NodeIPC
var arena *field.Arena

func loop() {
	client.SendDsStatus(arena.GetAllianceStationStatuses())
}

const (
	loopInterval = 5 * time.Second
)

func main() {
	fmt.Println("starting")
	var err error
	arena, err = field.NewArena()
	if err != nil {
		panic(err)
	}
	client = ipc.NewClient(arena)

	ticker := time.NewTicker(loopInterval)

	loopChan := make(chan struct{})

	go func() {
		loop()
		for {
			select {
			case <-ticker.C:
				loop()
			case <-loopChan:
				ticker.Stop()
				return
			}
		}
	}()
	go arena.Run()
	for {
		client.Loop()
	}
}
