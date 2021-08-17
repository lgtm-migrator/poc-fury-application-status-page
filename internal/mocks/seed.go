// Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package mocks

import (
	"fmt"
	"github.com/sighupio/poc-fury-application-status-page/internal/common"
	"sort"
	"time"
)

type CreationData struct {
	MockedScenario string
	MockedTargetLabel string
	MockedFailedStatus bool
}

type Target string
type CheckType string
type Status string

const (
	Ratings Target = "Ratings"
	Product Target = "Product"
	Reviews Target = "Reviews"
	Details Target = "Details"
)

const (
	HTTP CheckType = "http-status-check"
	EP   CheckType = "service-endpoints-check"
)

const (
	Complete Status = "Complete"
	Failed   Status = "Failed"
)

var Scenario1 = MockScenario{
	Description: "no failed check",
	Id:          "Scenario1",
	Data:        createScenario1Data(),
}

var Scenario2 = MockScenario{
	Description: "all failed checks",
	Id:          "Scenario2",
	Data:        createScenario2Data(),
}

var Scenario3 = MockScenario{
	Description: "Only Ratings - HTTP is failing",
	Id:          "Scenario3",
	Data:        createScenario3Data(),
}

func MockScenarioDataFactory(mockCreationData CreationData) []common.HealthCheck {
	scenarios := []MockScenario{
		Scenario1,
		Scenario2,
		Scenario3,
	}

	for _, scenario := range scenarios {
		if scenario.Id == mockCreationData.MockedScenario {
			return scenario.GetMockedData(mockCreationData.MockedTargetLabel, mockCreationData.MockedFailedStatus)
		}
	}

	// Default scenario
	return Scenario1.GetMockedData(mockCreationData.MockedTargetLabel, mockCreationData.MockedFailedStatus)
}

func createScenario1Data() []common.HealthCheck {
	timeNow := time.Now().UTC()
	numOfChecks := 200

	ratingsHttp, _ := mockChecks(Ratings, numOfChecks, timeNow, Complete, HTTP, 5)
	ratingsEp, _ := mockChecks(Ratings, numOfChecks, timeNow, Complete, EP, 15)
	detailsHttp, _ := mockChecks(Details, numOfChecks, timeNow, Complete, HTTP, 5)
	detailsEp, _ := mockChecks(Details, numOfChecks, timeNow, Complete, EP, 15)
	productHttp, _ := mockChecks(Product, numOfChecks, timeNow, Complete, HTTP, 5)
	productEp, _ := mockChecks(Product, numOfChecks, timeNow, Complete, EP, 15)

	unflattenedData := [][]common.HealthCheck{
		ratingsHttp,
		ratingsEp,
		detailsHttp,
		detailsEp,
		productHttp,
		productEp,
	}

	mockedData := flattenMockedData(&unflattenedData, numOfChecks)

	return mockedData
}

func createScenario2Data() []common.HealthCheck {
	timeNow := time.Now().UTC()
	numOfChecks := 200

	ratingsHttp, _ := mockChecks(Ratings, numOfChecks, timeNow, Failed, HTTP, 5)
	ratingsEp, _ := mockChecks(Ratings, numOfChecks, timeNow, Failed, EP, 15)
	detailsHttp, _ := mockChecks(Details, numOfChecks, timeNow, Failed, HTTP, 5)
	detailsEp, _ := mockChecks(Details, numOfChecks, timeNow, Failed, EP, 15)
	productHttp, _ := mockChecks(Product, numOfChecks, timeNow, Failed, HTTP, 5)
	productEp, _ := mockChecks(Product, numOfChecks, timeNow, Failed, EP, 15)

	unflattenedData := [][]common.HealthCheck{
		ratingsHttp,
		ratingsEp,
		detailsHttp,
		detailsEp,
		productHttp,
		productEp,
	}

	mockedData := flattenMockedData(&unflattenedData, numOfChecks)

	return mockedData
}

func createScenario3Data() []common.HealthCheck {
	timeNow := time.Now().UTC()
	numOfChecks := 200

	ratingsHttp, _ := mockChecks(Ratings, numOfChecks, timeNow, Failed, HTTP, 5)
	ratingsEp, _ := mockChecks(Ratings, numOfChecks, timeNow, Complete, EP, 15)
	detailsHttp, _ := mockChecks(Details, numOfChecks, timeNow, Complete, HTTP, 5)
	detailsEp, _ := mockChecks(Details, numOfChecks, timeNow, Complete, EP, 15)
	productHttp, _ := mockChecks(Product, numOfChecks, timeNow, Complete, HTTP, 5)
	productEp, _ := mockChecks(Product, numOfChecks, timeNow, Complete, EP, 15)

	unflattenedData := [][]common.HealthCheck{
		ratingsHttp,
		ratingsEp,
		detailsHttp,
		detailsEp,
		productHttp,
		productEp,
	}

	mockedData := flattenMockedData(&unflattenedData, numOfChecks)

	return mockedData
}

func flattenMockedData(unflattenedData *[][]common.HealthCheck, numOfChecks int) []common.HealthCheck {
	mockedData := make([]common.HealthCheck, len(*unflattenedData)*numOfChecks)

	var cursor int

	for _, s := range *unflattenedData {
		cursor += copy(mockedData[cursor:], s)
	}

	sortByCompletedAt(&mockedData)

	return mockedData
}

func sortByCompletedAt(dataToSort *[]common.HealthCheck) {
	sort.SliceStable((*dataToSort)[:], func(i, j int) bool {
		parsedFirstTime, _ := time.Parse(time.RFC3339, (*dataToSort)[i].CompletedAt)
		parsedSecondTime, _ := time.Parse(time.RFC3339, (*dataToSort)[j].CompletedAt)
		return parsedFirstTime.After(parsedSecondTime)
	})
}

func mockChecks(target Target, num int, startTime time.Time, status Status, checkName CheckType, frequency int) ([]common.HealthCheck, error) {
	resultData := make([]common.HealthCheck, num)
	// in seconds
	duration := 5
	errorMessage := ""

	if status == "Failed" {
		duration = 60
		errorMessage = "Job was active longer than specified deadline"
	}

	for index := range resultData {
		newStartTime := startTime.Add(time.Second * time.Duration(-duration)).Format(time.RFC3339)
		newCompletedAt := startTime.Format(time.RFC3339)

		if index > 0 {
			lastCompletedAt, err := time.Parse(time.RFC3339, resultData[index-1].CompletedAt)

			if err != nil {
				return resultData, err
			}

			newStartTime = lastCompletedAt.Add(time.Minute*time.Duration(-frequency) + time.Second*time.Duration(-duration)).Format(time.RFC3339)
			newCompletedAt = lastCompletedAt.Add(time.Minute * time.Duration(-frequency)).Format(time.RFC3339)
		}

		resultData[index] = common.HealthCheck{
			Group:       "BookInfo",
			Target:      string(target),
			StartTime:   newStartTime,
			CompletedAt: newCompletedAt,
			Duration:    fmt.Sprintf("%ds", duration),
			Status:      string(status),
			Namespace:   "bookinfo",
			PodName:     "",
			CheckName:   string(checkName),
			Owner:       "healthcheck-controller",
			Error:       errorMessage,
			Frequency:   frequency,
		}
	}

	return resultData, nil
}
