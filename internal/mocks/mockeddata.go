package mocks

import (
	"github.com/sighupio/poc-fury-application-status-page/internal/resources"
)

type MockFunc func(scenario *MockScenario) []resources.HealthCheck

type MockScenario struct {
	Description string
	Id          string
	Data        []resources.HealthCheck
}

var Scenario1 = MockScenario{
	Description: "all failed checks",
	Id:          "Scenario1",
	Data: []resources.HealthCheck{
		{
			Group:       "BookInfo",
			Target:      "Ratings",
			StartTime:   "2021-08-04T16:00:04Z",
			CompletedAt: "2021-08-04T16:01:04Z",
			Duration:    "60s",
			Status:      "Failed",
			Namespace:   "bookinfo",
			PodName:     "",
			CheckName:   "http-status-check",
			Owner:       "healthcheck-controller",
			Error:       "Job was active longer than specified deadline",
			Frequency:   5,
		},
	},
}

var Scenario2 = MockScenario{
	Description: "no failed checks",
	Id:          "Scenario2",
	Data: []resources.HealthCheck{
		{
			Group:       "BookInfo",
			Target:      "Ratings",
			StartTime:   "2021-08-04T16:00:04Z",
			CompletedAt: "2021-08-04T16:01:04Z",
			Duration:    "60s",
			Status:      "Complete",
			Namespace:   "bookinfo",
			PodName:     "test",
			CheckName:   "http-status-check",
			Owner:       "healthcheck-controller",
			Error:       "",
			Frequency:   5,
		},
	},
}

func MockScenarioFactory(id string) *MockScenario {
	switch id {
	case "Scenario1":
		return &Scenario1
	case "Scenario2":
		return &Scenario2
	default:
		return &Scenario1
	}
}

func MockGroupTarget(m *MockScenario) []resources.HealthCheck {
	return m.Data
}

func MockFailedGroup(m *MockScenario) []resources.HealthCheck {
	return m.Data
}

func MockGroup(m *MockScenario) []resources.HealthCheck {
	return m.Data
}
