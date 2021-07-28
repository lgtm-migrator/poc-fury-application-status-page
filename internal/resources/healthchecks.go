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

type HealthCheckFilterPredicate func(HealthCheck, HealthCheck) bool

type ApiResponse struct {
	Data []HealthCheck `json:"data"`
	ErrorMessage string `json:"errorMessage"`
}

func ListLastChecks(c *gin.Context) {
	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: "cannot read config file"})
		return
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s", cfg.ApiUrl, cfg.GroupLabel)

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		c.JSON(http.StatusBadRequest, &ApiResponse{ErrorMessage: "cannot get list"})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: "IO error on get list"})
			return
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: "cannot read content on get list"})
		return
	}

	var healthChecks []HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: "cannot convert to json"})
		return
	}

	resultHealthChecks, err := filterHealthChecksByCheckNameTarget(&healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponse{Data: resultHealthChecks})
}

func ListLastChecksAndIssuesByTarget(c *gin.Context) {
	targetLabel := c.Param("targetLabel")

	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: "cannot read config file"})
		return
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s/target/%s", cfg.ApiUrl, cfg.GroupLabel, targetLabel)

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		fmt.Printf("error: %s\n", err.Error())
		c.JSON(http.StatusBadRequest, &ApiResponse{ErrorMessage: "cannot get list by target"})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: "IO error on get list by target"})
			return
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: "cannot read content on get list by target"})
		return
	}

	var healthChecks []HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: "cannot convert to json"})
		return
	}

	resultHealthChecks, err := filterHealthChecksByCheckNameTargetStatus(&healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponse{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponse{Data: resultHealthChecks})
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
