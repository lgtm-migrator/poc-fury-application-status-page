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
	mockedScenario := c.Query("mockedScenario")

	healthChecks, err := resources.RemoteDataGet(c, &resources.RequestConfig{
		ConfigError:        "Cannot read config yaml file",
		MockedScenario:     mockedScenario,
		RemoteRequestError: "Cannot get list, reason: ",
		BodyCloseError:     "IO error on get list, reason: ",
		BodyParseError:     "Cannot read content on get list, reason: ",
		JsonParseError:     "Cannot convert data to JSON, reason: ",
	})

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
	mockedScenario := c.Query("mockedScenario")

	healthChecks, err := resources.RemoteDataGet(c, &resources.RequestConfig{
		TargetLabel:        targetLabel,
		ConfigError:        "Cannot read config yaml file",
		MockedScenario:     mockedScenario,
		RemoteRequestError: "Cannot get list by target, reason: ",
		BodyCloseError:     "IO error on get list by target, reason: ",
		BodyParseError:     "Cannot read content on get list by target, reason: ",
		JsonParseError:     "Cannot convert data to JSON, reason: ",
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
}
