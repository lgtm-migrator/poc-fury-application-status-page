package resources

import (
	"encoding/json"
	"github.com/go-resty/resty/v2"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"github.com/sighupio/poc-fury-application-status-page/internal/mocks"
	"net/http"
	"net/http/httptest"
	"os"
)

type fakeHealthChecksManager struct {
	httpClient   *resty.Client
	CreationData *mocks.CreationData
	Config       *config.YamlConfig
}

func (rd *fakeHealthChecksManager) Get(f *HealthChecksFilters) (healthChecks HealthChecks, err error) {

	mockedData := mocks.MockScenarioDataFactory(*rd.CreationData)

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(mockedData)
	}))

	defer ts.Close()

	cfg := rd.Config

	cfg.ApiUrl = ts.URL

	rm := remoteHealthChecksManager{
		httpClient: rd.httpClient,
		cfg:        cfg,
	}

	return rm.Get(f)
}

func NewFakeDataManager(client *resty.Client, yamlConfig *config.YamlConfig) HealthChecksManager {
	create := &mocks.CreationData{
		MockedScenario:     mocks.Scenario1.Id,
		MockedTargetLabel:  "",
		MockedFailedStatus: false,
	}

	if os.Getenv("FAKE_SCENARIO_ID") != "" {
		create.MockedScenario = os.Getenv("FAKE_SCENARIO_ID")
	}

	return &fakeHealthChecksManager{
		CreationData: create,
		Config:       yamlConfig,
		httpClient:   client,
	}
}
