package resources

import (
	"github.com/go-resty/resty/v2"
	"github.com/jarcoal/httpmock"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"github.com/sighupio/poc-fury-application-status-page/internal/mocks"
	"os"
)

type fakeHealthChecksManager struct {
	httpClient   *resty.Client
	CreationData *mocks.CreationData
	Config       *config.YamlConfig
}

func (rd *fakeHealthChecksManager) Get(f *HealthChecksFilters) (healthChecks HealthChecks, err error) {
	newCreationData := rd.CreationData

	newCreationData.MockedTargetLabel = f.Target
	newCreationData.MockedFailedStatus = f.Failed

	mockedData := mocks.MockScenarioDataFactory(*newCreationData)

	rm := remoteHealthChecksManager{
		httpClient: rd.httpClient,
		cfg:        rd.Config,
	}

	url, _ := rm.createCompleteUrlWithFilters(f)

	httpmock.ActivateNonDefault(rm.httpClient.GetClient())
	responder := httpmock.NewJsonResponderOrPanic(200, mockedData)
	httpmock.RegisterResponder("GET", url, responder)

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
