package resources

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"io"
	"io/ioutil"
	"net/http"
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

type HealthCheckGroupedByDay struct {
	DayDate string `json:"dayDate"`
	Count int `json:"count"`
}

type HealthCheckFilterPredicate func(HealthCheck, HealthCheck) bool

type HealthCheckGroupedByDayFilterPredicate func(time.Time, time.Time) bool

type ApiResponseHealthCheck struct {
	Data []HealthCheck `json:"data"`
	ErrorMessage string `json:"errorMessage"`
}

type ApiResponseHealthCheckGroupedByDay struct {
	Data []HealthCheckGroupedByDay `json:"data"`
	ErrorMessage string `json:"errorMessage"`
}

func ListLastChecks(c *gin.Context) {
	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot read config file"})
		return
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s", cfg.ApiUrl, cfg.GroupLabel)

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		c.JSON(http.StatusBadRequest, &ApiResponseHealthCheck{ErrorMessage: "cannot get list"})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "IO error on get list"})
			return
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot read content on get list"})
		return
	}

	var healthChecks []HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot convert to json"})
		return
	}

	resultHealthChecks, err := filterHealthChecksByCheckNameTarget(&healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheck{Data: resultHealthChecks})
}

func ListLastChecksAndIssuesByTarget(c *gin.Context) {
	targetLabel := c.Param("targetLabel")

	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot read config file"})
		return
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s/target/%s", cfg.ApiUrl, cfg.GroupLabel, targetLabel)

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		fmt.Printf("error: %s\n", err.Error())
		c.JSON(http.StatusBadRequest, &ApiResponseHealthCheck{ErrorMessage: "cannot get list by target"})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "IO error on get list by target"})
			return
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot read content on get list by target"})
		return
	}

	var healthChecks []HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot convert to json"})
		return
	}

	resultHealthChecks, err := filterHealthChecksByCheckNameTargetStatus(&healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheck{Data: resultHealthChecks})
}

func FailedHealthCheckGroupByDay(c *gin.Context) {
	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: "cannot read config file"})
		return
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s?status=Failed&limit=500", cfg.ApiUrl, cfg.GroupLabel)

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		c.JSON(http.StatusBadRequest, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: "cannot get list"})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: "IO error on get list"})
			return
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: "cannot read content on get list"})
		return
	}

	var healthChecks []HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: "cannot convert to json"})
		return
	}

	resultHealthChecks, err := groupByDayHealthChecks(&healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheckGroupedByDay{Data: resultHealthChecks})
}

func FailedHealthChecksFilterByDay(c *gin.Context) {
	paramsDay := c.Param("day")
	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot read config file"})
		return
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s?status=Failed&limit=500", cfg.ApiUrl, cfg.GroupLabel)

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		fmt.Printf("error: %s\n", err.Error())
		c.JSON(http.StatusBadRequest, &ApiResponseHealthCheck{ErrorMessage: "cannot get list by target"})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "IO error on get list by target"})
			return
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot read content on get list by target"})
		return
	}

	var healthChecks []HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot convert to json"})
		return
	}

	resultHealthChecks, err := filterHealthChecksBySameDay(&healthChecks, paramsDay)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheck{Data: resultHealthChecks})
}

func filterHealthChecksBySameDay(healthChecks *[]HealthCheck, paramsDay string) ([]HealthCheck, error) {
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

func groupByDayHealthChecks(healthChecks *[]HealthCheck) ([]HealthCheckGroupedByDay, error) {
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

func twoDatesOnSameDayPredicate(a time.Time, b time.Time) bool {
	return a.Day() == b.Day() && a.Month() == b.Month() && a.Year() == b.Year()
}

func filterHealthChecksByCheckNameTarget(healthChecks *[]HealthCheck) ([]HealthCheck, error) {
	predicate := func(a HealthCheck, b HealthCheck) bool {
		return a.CheckName == b.CheckName && a.Target == b.Target
	}

	return filterHealthChecks(healthChecks, predicate)
}

func filterHealthChecksByCheckNameTargetStatus(healthChecks *[]HealthCheck) ([]HealthCheck, error) {
	predicate := func(a HealthCheck, b HealthCheck) bool {
		return a.CheckName == b.CheckName && a.Target == b.Target && a.Status == b.Status
	}

	return filterHealthChecks(healthChecks, predicate)
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
