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
	healthChecks, err := remoteDataGet(c, &RequestConfig{
		FailedFilter:       true,
		ConfigError:        "Cannot read config yaml file",
		RemoteRequestError: "Cannot get grouped by day list, reason: ",
		BodyCloseError:     "IO error on get grouped by day list, reason: ",
		BodyParseError:     "Cannot read content on get grouped by day list, reason: ",
		JsonParseError:     "Cannot convert data to JSON, reason: ",
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

	healthChecks, err := remoteDataGet(c, &RequestConfig{
		FailedFilter:       true,
		ConfigError:        "Cannot read config yaml file",
		RemoteRequestError: "Cannot get filter by day list, reason: ",
		BodyCloseError:     "IO error on get filter by day list, reason: ",
		BodyParseError:     "Cannot read content on get filter by day list, reason: ",
		JsonParseError:     "Cannot convert data to JSON, reason: ",
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
