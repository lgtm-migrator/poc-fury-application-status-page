package resources

import (
	"github.com/sighupio/poc-fury-application-status-page/internal/mocks"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestHealthChecks_FilterByCheckNameTarget(t *testing.T) {
	scenario1Data := HealthChecks(mocks.Scenario1.Data)

	filteredByCheckNameTarget1, err := scenario1Data.FilterByCheckNameTarget()

	assert.Nil(t, err)
	assert.Equal(t, 6, len(filteredByCheckNameTarget1))

	for _, elem := range filteredByCheckNameTarget1 {
		assert.Equal(t, elem.Status, "Complete")
	}

	scenario2Data := HealthChecks(mocks.Scenario2.Data)

	filteredByCheckNameTarget2, err := scenario2Data.FilterByCheckNameTarget()

	assert.Nil(t, err)
	assert.Equal(t, 6, len(filteredByCheckNameTarget2))

	for _, elem := range filteredByCheckNameTarget2 {
		assert.Equal(t, elem.Status, "Failed")
	}

	scenario3Data := HealthChecks(mocks.Scenario3.Data)

	filteredByCheckNameTarget3, err := scenario3Data.FilterByCheckNameTarget()

	assert.Nil(t, err)
	assert.Equal(t, 6, len(filteredByCheckNameTarget3))

	for _, elem := range filteredByCheckNameTarget3 {
		if elem.Target == string(mocks.Ratings) && elem.CheckName == string(mocks.HTTP) {
			assert.Equal(t, elem.Status, "Failed")
			continue
		}

		assert.Equal(t, elem.Status, "Complete")
	}
}

func TestHealthChecks_FilterByCheckNameTargetStatus(t *testing.T) {
	scenario1CreationData := mocks.CreationData{
		MockedScenario:     mocks.Scenario1.Id,
		MockedTargetLabel:  string(mocks.Ratings),
	}
	scenario1Data := HealthChecks(mocks.MockScenarioDataFactory(scenario1CreationData))

	filteredByCheckNameTargetStatus1, err := scenario1Data.FilterByCheckNameTargetStatus()

	assert.Nil(t, err)
	assert.Equal(t, 2, len(filteredByCheckNameTargetStatus1))

	for _, elem := range filteredByCheckNameTargetStatus1 {
		assert.Equal(t, elem.Status, "Complete")
	}

	scenario2CreationData := mocks.CreationData{
		MockedScenario:     mocks.Scenario2.Id,
		MockedTargetLabel:  string(mocks.Ratings),
	}
	scenario2Data := HealthChecks(mocks.MockScenarioDataFactory(scenario2CreationData))

	filteredByCheckNameTargetStatus2, err := scenario2Data.FilterByCheckNameTargetStatus()

	assert.Nil(t, err)
	assert.Equal(t, 2, len(filteredByCheckNameTargetStatus2))

	for _, elem := range filteredByCheckNameTargetStatus2 {
		assert.Equal(t, elem.Status, "Failed")
	}

	scenario3CreationData := mocks.CreationData{
		MockedScenario:     mocks.Scenario3.Id,
		MockedTargetLabel:  string(mocks.Ratings),
	}
	scenario3Data := HealthChecks(mocks.MockScenarioDataFactory(scenario3CreationData))

	filteredByCheckNameTargetStatus3, err := scenario3Data.FilterByCheckNameTargetStatus()

	assert.Nil(t, err)
	assert.Equal(t, 2, len(filteredByCheckNameTargetStatus3))

	for _, elem := range filteredByCheckNameTargetStatus3 {
		if elem.Target == string(mocks.Ratings) && elem.CheckName == string(mocks.HTTP) {
			assert.Equal(t, elem.Status, "Failed")
			continue
		}

		assert.Equal(t, elem.Status, "Complete")
	}
}

func TestHealthChecks_FilterBySameDay(t *testing.T) {
	scenario1CreationData := mocks.CreationData{
		MockedScenario:     mocks.Scenario1.Id,
		MockedFailedStatus: true,
	}
	scenario1Data := HealthChecks(mocks.MockScenarioDataFactory(scenario1CreationData))

	filteredBySameDay1, err := scenario1Data.FilterBySameDay(time.Now().Format("2006-01-02"))

	assert.Nil(t, err)
	assert.Equal(t, 0, len(filteredBySameDay1))

	scenario2CreationData := mocks.CreationData{
		MockedScenario:     mocks.Scenario2.Id,
		MockedFailedStatus: true,
	}
	scenario2Data := HealthChecks(mocks.MockScenarioDataFactory(scenario2CreationData))

	filteredBySameDay2, err := scenario2Data.FilterBySameDay(time.Now().Format("2006-01-02"))

	assert.Nil(t, err)
	assert.Greater(t, len(filteredBySameDay2), 0)

	for _, elem := range filteredBySameDay1 {
		assert.Equal(t, elem.Status, "Failed")
	}
}

func TestHealthChecks_GroupByDay(t *testing.T) {
	scenario1CreationData := mocks.CreationData{
		MockedScenario:     mocks.Scenario1.Id,
		MockedFailedStatus: true,
	}
	scenario1Data := HealthChecks(mocks.MockScenarioDataFactory(scenario1CreationData))

	groupedByDay1, err := scenario1Data.GroupByDay()

	assert.Nil(t, err)
	assert.Equal(t, len(groupedByDay1), 0)
}
