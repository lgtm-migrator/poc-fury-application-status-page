package resources

import (
	"fmt"
	"github.com/go-resty/resty/v2"
	"github.com/sighupio/poc-fury-application-status-page/internal/config"
	"strconv"
)

type HealthChecksManager interface {
	Get(f *HealthChecksFilters) (healthChecks HealthChecks, err error)
}

type HealthChecksFilters struct {
	Target string
	Failed bool
	Limit  int
}

type remoteHealthChecksManager struct {
	httpClient *resty.Client
	cfg        *config.YamlConfig
}

func NewRemoteDataManager(client *resty.Client, yamlConfig *config.YamlConfig) HealthChecksManager {

	return &remoteHealthChecksManager{
		httpClient: client,
		cfg:        yamlConfig,
	}
}

func (rd *remoteHealthChecksManager) Get(f *HealthChecksFilters) (healthChecks HealthChecks, err error) {

	url := fmt.Sprintf("%s/group/%s", rd.cfg.ApiUrl, rd.cfg.GroupLabel)

	if f.Target != "" {
		url = url + fmt.Sprintf("/target/%s", f.Target)
	}

	query := rd.httpClient.
		R().
		SetResult(&healthChecks)

	if f.Failed {
		query = query.SetQueryParam("status", "Failed")
	}

	if f.Limit != 0 {
		query = query.SetQueryParam("limit", strconv.Itoa(f.Limit))
	}

	_, err = query.Get(url)

	return healthChecks, err
}
