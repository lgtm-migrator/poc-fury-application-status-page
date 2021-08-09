package mocks

import (
	"github.com/sighupio/poc-fury-application-status-page/internal/common"
)

type MockScenario struct {
	Description string
	Id          string
	Data        []common.HealthCheck
}

func (m *MockScenario) GetMockedData(targetLabel string, failedStatus bool) []common.HealthCheck {
	if targetLabel != "" {
		return m.filterTarget(targetLabel)
	}

	if failedStatus {
		return m.filterFailed()
	}

	return m.Data
}

func (m *MockScenario) filterTarget(targetLabel string) []common.HealthCheck {
	var resultData []common.HealthCheck

	for _, elem := range m.Data {
		if elem.Target == targetLabel {
			resultData = append(resultData, elem)
		}
	}

	return resultData
}

func (m *MockScenario) filterFailed() []common.HealthCheck {
	var resultData []common.HealthCheck

	for _, elem := range m.Data {
		if elem.Status == "Failed" {
			resultData = append(resultData, elem)
		}
	}

	return resultData
}
