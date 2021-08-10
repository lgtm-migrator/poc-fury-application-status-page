package server

import (
	"github.com/gin-gonic/gin"
	"github.com/sighupio/poc-fury-application-status-page/internal/resources"
	"net/http"
)

type ApiResponseHealthCheckGroupedByDay struct {
	Data         resources.HealthChecksGroupedByDay `json:"data"`
	ErrorMessage string                             `json:"errorMessage"`
}

func failedHealthCheckGroupByDay(c *gin.Context) {
	svcProvider := c.MustGet(serviceProvider).(ServiceProvider)

	healthChecks, err := svcProvider.HealthChecksManager.Get(&resources.HealthChecksFilters{
		Failed: true,

	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: err.Error()})
		return
	}

	resultHealthChecks, err := healthChecks.GroupByDay()

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheckGroupedByDay{Data: resultHealthChecks})
}

func failedHealthChecksFilterByDay(c *gin.Context) {
	paramsDay := c.Param("day")
	svcProvider := c.MustGet(serviceProvider).(ServiceProvider)

	healthChecks, err := svcProvider.HealthChecksManager.Get(&resources.HealthChecksFilters{
		Failed: true,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	resultHealthChecks, err := healthChecks.FilterBySameDay(paramsDay)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheck{Data: resultHealthChecks})
}
