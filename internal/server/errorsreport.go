package server

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"github.com/sighupio/poc-fury-application-status-page/internal/resources"
	"io"
	"io/ioutil"
	"net/http"
)

type ApiResponseHealthCheckGroupedByDay struct {
	Data []resources.HealthCheckGroupedByDay `json:"data"`
	ErrorMessage string `json:"errorMessage"`
}

func failedHealthCheckGroupByDay(c *gin.Context) {
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

	var healthChecks []resources.HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: "cannot convert to json"})
		return
	}

	resultHealthChecks, err := resources.GroupByDayHealthChecks(&healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheckGroupedByDay{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheckGroupedByDay{Data: resultHealthChecks})
}

func failedHealthChecksFilterByDay(c *gin.Context) {
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

	var healthChecks []resources.HealthCheck

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: "cannot convert to json"})
		return
	}

	resultHealthChecks, err := resources.FilterHealthChecksBySameDay(&healthChecks, paramsDay)

	if err != nil {
		c.JSON(http.StatusInternalServerError, &ApiResponseHealthCheck{ErrorMessage: err.Error()})
		return
	}

	c.JSON(http.StatusOK, &ApiResponseHealthCheck{Data: resultHealthChecks})
}
