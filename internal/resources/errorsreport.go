package resources

import (
	"time"
)

type HealthCheckGroupedByDay struct {
	DayDate string `json:"dayDate"`
	Count int `json:"count"`
}

type HealthCheckGroupedByDayFilterPredicate func(time.Time, time.Time) bool

func GroupByDayHealthChecks(healthChecks *[]HealthCheck) ([]HealthCheckGroupedByDay, error) {
	var resultHealthChecks []HealthCheckGroupedByDay

	for _ , healthCheck := range *healthChecks {
		indexFound, err := findExistingHealthCheckGroupedByDayIndexByPredicate(&resultHealthChecks, healthCheck, twoDatesOnSameDayPredicate)

		if err != nil {
			return resultHealthChecks, err
		}

		if indexFound == -1 {
			resultHealthChecks = append(resultHealthChecks, HealthCheckGroupedByDay{
				DayDate: healthCheck.CompletedAt,
				Count: 1,
			})
			continue
		}

		resultHealthChecks[indexFound].Count++
	}

	return resultHealthChecks, nil
}

func FilterHealthChecksBySameDay(healthChecks *[]HealthCheck, paramsDay string) ([]HealthCheck, error) {
	var resultHealthChecks []HealthCheck
	parsedParamsDay, err := time.Parse("2006-01-02", paramsDay)

	if err != nil {
		return resultHealthChecks, err
	}

	for _ , healthCheck := range *healthChecks {
		parsedHealthCheckTime, err := time.Parse(time.RFC3339, healthCheck.CompletedAt)

		if err != nil {
			return resultHealthChecks, err
		}


		if twoDatesOnSameDayPredicate(parsedParamsDay, parsedHealthCheckTime) {
			resultHealthChecks = append(resultHealthChecks, healthCheck)
		}
	}

	return resultHealthChecks, nil
}

func twoDatesOnSameDayPredicate(a time.Time, b time.Time) bool {
	return a.Day() == b.Day() && a.Month() == b.Month() && a.Year() == b.Year()
}

func findExistingHealthCheckGroupedByDayIndexByPredicate(healthChecksGroupedByDay *[]HealthCheckGroupedByDay, currentHealthCheck HealthCheck, predicate HealthCheckGroupedByDayFilterPredicate) (int, error) {
	for i := range *healthChecksGroupedByDay {
		parsedHealthCheckGroupedTime, err := time.Parse(time.RFC3339, (*healthChecksGroupedByDay)[i].DayDate)

		if err != nil {
			return -1, err
		}

		parsedCurrentHealthCheckTime, err := time.Parse(time.RFC3339, currentHealthCheck.CompletedAt)

		if err != nil {
			return -1, err
		}

		if predicate(parsedHealthCheckGroupedTime, parsedCurrentHealthCheckTime) {
			return i, nil
		}
	}

	return -1, nil
}
