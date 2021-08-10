package server

import (
	"github.com/gin-gonic/gin"
	"github.com/sighupio/poc-fury-application-status-page/internal/resources"
	"net/http"
)

type ApiResponseHealthCheck struct {
	Data         resources.HealthChecks `json:"data"`
	ErrorMessage string              `json:"errorMessage"`
}

func listLastChecks(c *gin.Context) {
	svcProvider := c.MustGet(serviceProvider).(ServiceProvider)

	healthChecks, err := svcProvider.HealthChecksManager.Get(&resources.HealthChecksFilters{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	resultHealthChecks, err := healthChecks.FilterByCheckNameTarget()

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheck{Data: resultHealthChecks})
}

func listLastChecksAndIssuesByTarget(c *gin.Context) {
	targetLabel := c.Param("targetLabel")
	svcProvider := c.MustGet(serviceProvider).(ServiceProvider)

	healthChecks, err := svcProvider.HealthChecksManager.Get(&resources.HealthChecksFilters{
		Target: targetLabel,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	resultHealthChecks, err := healthChecks.FilterByCheckNameTargetStatus()

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheck{Data: resultHealthChecks})
	return
}
