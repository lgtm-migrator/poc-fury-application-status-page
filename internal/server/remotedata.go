package server

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"github.com/sighupio/poc-fury-application-status-page/internal/resources"
	"io"
	"io/ioutil"
	"net/http"
)

type RequestConfig struct {
	TargetLabel        string
	FailedFilter       bool
	ConfigError        string
	RemoteRequestError string
	BodyCloseError     string
	BodyParseError     string
	JsonParseError     string
}

func remoteDataGet(c *gin.Context, r *RequestConfig) (resources.HealthChecks, error) {
	var healthChecks resources.HealthChecks
	var bodyCloseErr error

	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		return healthChecks, errors.New(r.ConfigError)
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s", cfg.ApiUrl, cfg.GroupLabel)

	if r.TargetLabel != "" {
		remoteApiUrl = fmt.Sprintf("%s/group/%s/target/%s", cfg.ApiUrl, cfg.GroupLabel, r.TargetLabel)
	}

	if r.FailedFilter {
		remoteApiUrl = fmt.Sprintf("%s/group/%s?status=Failed&limit=500", cfg.ApiUrl, cfg.GroupLabel)
	}

	resp, err := http.Get(remoteApiUrl)

	if err != nil {
		return healthChecks, errors.New(r.RemoteRequestError + err.Error())
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			bodyCloseErr = errors.New(r.BodyCloseError + err.Error())
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return healthChecks, errors.New(r.BodyParseError + err.Error())
	}

	err = json.Unmarshal(body, &healthChecks)

	if err != nil {
		return healthChecks, errors.New(r.JsonParseError + err.Error())
	}

	return healthChecks, bodyCloseErr
}
