package resources

import (
	"time"
)

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

type SameDayPredicate func(time.Time, time.Time) bool

type HealthCheckFilterPredicate func(HealthCheck, HealthCheck) bool

type HealthChecks []HealthCheck

type HealthChecksGroupedByDay []HealthCheckGroupedByDay

func (h *HealthChecks) FilterByCheckNameTarget() (HealthChecks, error) {
	predicate := func(a HealthCheck, b HealthCheck) bool {
		return a.CheckName == b.CheckName && a.Target == b.Target
	}

	return h.filter(predicate)
}

func (h *HealthChecks) FilterByCheckNameTargetStatus() (HealthChecks, error) {
	predicate := func(a HealthCheck, b HealthCheck) bool {
		return a.CheckName == b.CheckName && a.Target == b.Target && a.Status == b.Status
	}

	return h.filter(predicate)
}

func (h *HealthChecks) FilterBySameDay(paramsDay string) (HealthChecks, error) {
	var resultHealthChecks HealthChecks
	parsedParamsDay, err := time.Parse("2006-01-02", paramsDay)

	if err != nil {
		return resultHealthChecks, err
	}

	for _, healthCheck := range *h {
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

func (h *HealthChecks) GroupByDay() (HealthChecksGroupedByDay, error) {
	resultHealthChecks := HealthChecksGroupedByDay{}

	for _, healthCheck := range *h {
		indexFound, err := resultHealthChecks.findIndexByPredicate(healthCheck, twoDatesOnSameDayPredicate)

		if err != nil {
			return resultHealthChecks, err
		}

		if indexFound == -1 {
			resultHealthChecks = append(resultHealthChecks, HealthCheckGroupedByDay{
				DayDate: healthCheck.CompletedAt,
				Count:   1,
			})
			continue
		}

		resultHealthChecks[indexFound].Count++
	}

	return resultHealthChecks, nil
}

func (h *HealthChecks) filter(predicate HealthCheckFilterPredicate) (HealthChecks, error) {
	resultHealthChecks := HealthChecks{}

	for _, healthCheck := range *h {
		indexFound := resultHealthChecks.findIndexByPredicate(healthCheck, predicate)

		if indexFound == -1 {
			resultHealthChecks = append(resultHealthChecks, healthCheck)
			continue
		}

		resultTime, resultTimeErr := time.Parse(time.RFC3339, resultHealthChecks[indexFound].CompletedAt)

		if resultTimeErr != nil {
			return resultHealthChecks, resultTimeErr
		}

		healthCheckTime, healthCheckTimeErr := time.Parse(time.RFC3339, healthCheck.CompletedAt)

		if healthCheckTimeErr != nil {
			return resultHealthChecks, healthCheckTimeErr
		}

		if resultTime.Before(healthCheckTime) {
			resultHealthChecks[indexFound] = healthCheck
		}
	}

	return resultHealthChecks, nil
}

func (h *HealthChecks) findIndexByPredicate(currentHealthCheck HealthCheck, predicate HealthCheckFilterPredicate) int {
	for i := range *h {
		if predicate((*h)[i], currentHealthCheck) {
			return i
		}
	}

	return -1
}

func (h *HealthChecksGroupedByDay) findIndexByPredicate(
	currentHealthCheck HealthCheck,
	predicate SameDayPredicate,
) (int, error) {
	for i := range *h {
		parsedHealthCheckGroupedTime, err := time.Parse(time.RFC3339, (*h)[i].DayDate)

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

func twoDatesOnSameDayPredicate(a time.Time, b time.Time) bool {
	return a.Day() == b.Day() && a.Month() == b.Month() && a.Year() == b.Year()
}
