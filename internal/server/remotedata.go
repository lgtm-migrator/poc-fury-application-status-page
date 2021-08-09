package server

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"github.com/sighupio/poc-fury-application-status-page/internal/mocks"
	"github.com/sighupio/poc-fury-application-status-page/internal/resources"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
)

type RequestConfig struct {
	TargetLabel        string
	MockedScenario     string
	FailedFilter       bool
	ConfigError        string
	RemoteRequestError string
	BodyCloseError     string
	BodyParseError     string
	JsonParseError     string
}

func RemoteDataGet(c *gin.Context, r *RequestConfig) (resources.HealthChecks, error) {
	var healthChecks resources.HealthChecks
	var bodyCloseErr error

	cfg, ok := c.MustGet("config").(config.YamlConfig)

	if !ok {
		return healthChecks, errors.New(r.ConfigError)
	}

	resp, err := getFactory(cfg, r)

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

func getFactory(cfg config.YamlConfig, r *RequestConfig) (resp *http.Response, err error) {
	if r.TargetLabel != "" {
		remoteApiUrl := fmt.Sprintf("%s/group/%s/target/%s", cfg.ApiUrl, cfg.GroupLabel, r.TargetLabel)
		return getMockOrRemote(remoteApiUrl, cfg.Mocked, mocks.CreationData{
			MockedScenario:     r.MockedScenario,
			MockedTargetLabel:  r.TargetLabel,
		})
	}

	if r.FailedFilter {
		remoteApiUrl := fmt.Sprintf("%s/group/%s?status=Failed&limit=500", cfg.ApiUrl, cfg.GroupLabel)
		return getMockOrRemote(remoteApiUrl, cfg.Mocked, mocks.CreationData{
			MockedScenario:     r.MockedScenario,
			MockedFailedStatus: true,
		})
	}

	remoteApiUrl := fmt.Sprintf("%s/group/%s", cfg.ApiUrl, cfg.GroupLabel)
	return getMockOrRemote(remoteApiUrl, cfg.Mocked, mocks.CreationData{
		MockedScenario:     r.MockedScenario,
	})
}

func getMockOrRemote(remoteApiUrl string, isMocked bool, mocksCreationData mocks.CreationData) (resp *http.Response, err error) {
	if isMocked {
		mockedData := mocks.MockScenarioDataFactory(mocksCreationData)

		ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			json.NewEncoder(w).Encode(mockedData)
		}))
		defer ts.Close()

		remoteApiUrl = ts.URL
	}

	return http.Get(remoteApiUrl)
}
