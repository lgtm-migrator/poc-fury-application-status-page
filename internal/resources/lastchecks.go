package resources

import (
	"time"
)

type HealthCheck struct {
	Group string `json:"group"`
	Target string `json:"target"`
	StartTime string `json:"startTime"`
	CompletedAt string `json:"completedAt"`
	Duration string `json:"duration"`
	Status string `json:"status"`
	Namespace string `json:"namespace"`
	PodName string `json:"podName"`
	CheckName string `json:"checkName"`
	Owner string `json:"owner"`
	Error string `json:"error"`
	Frequency int `json:"frequency"`
}

type HealthCheckFilterPredicate func(HealthCheck, HealthCheck) bool

func FilterHealthChecksByCheckNameTarget(healthChecks *[]HealthCheck) ([]HealthCheck, error) {
	predicate := func(a HealthCheck, b HealthCheck) bool {
		return a.CheckName == b.CheckName && a.Target == b.Target
	}

	return filterHealthChecks(healthChecks, predicate)
}

func FilterHealthChecksByCheckNameTargetStatus(healthChecks *[]HealthCheck) ([]HealthCheck, error) {
	predicate := func(a HealthCheck, b HealthCheck) bool {
		return a.CheckName == b.CheckName && a.Target == b.Target && a.Status == b.Status
	}

	return filterHealthChecks(healthChecks, predicate)
}

func findExistingHealthCheckIndexByPredicate(healthChecks *[]HealthCheck, currentHealthCheck HealthCheck, predicate HealthCheckFilterPredicate) int {
	for i := range *healthChecks {
		if predicate((*healthChecks)[i], currentHealthCheck) {
			return i
		}
	}

	return -1
}

func filterHealthChecks(healthChecks *[]HealthCheck, predicate HealthCheckFilterPredicate) ([]HealthCheck, error) {
	var resultHealthChecks []HealthCheck

	for _ , healthCheck := range *healthChecks {
		indexFound := findExistingHealthCheckIndexByPredicate(&resultHealthChecks, healthCheck, predicate)

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
