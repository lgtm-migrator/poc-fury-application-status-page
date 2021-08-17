// Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package common

type HealthCheck struct {
	Group       string `json:"group"`
	Target      string `json:"target"`
	StartTime   string `json:"startTime"`
	CompletedAt string `json:"completedAt"`
	Duration    string `json:"duration"`
	Status      string `json:"status"`
	Namespace   string `json:"namespace"`
	PodName     string `json:"podName"`
	CheckName   string `json:"checkName"`
	Owner       string `json:"owner"`
	Error       string `json:"error"`
	Frequency   int    `json:"frequency"`
}

type HealthCheckGroupedByDay struct {
	DayDate string `json:"dayDate"`
	Count   int    `json:"count"`
}
