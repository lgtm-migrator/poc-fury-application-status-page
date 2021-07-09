import {ClusterStatus, MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../types";
import {scenarioOneData} from "./ScenarioOne";
import {scenarioTwoData} from "./ScenarioTwo";
import {ScenarioCluster} from "./types";
import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";

function getStatusIfPresent(status?: ClusterStatus) {
  if(status) {
    return {
      status: status
    }
  }

  return {}
}

function getFailedAtIfPresent(failedAt?: string) {
  if (failedAt) {
    return {
      failedAt: failedAt
    }
  }

  return {}
}

function generateSeedFromScenario(scenarioData: ScenarioCluster[]) {
  return function(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) {
    scenarioData.forEach(scenarioClusterData => {
      const seededCluster = server.create("cluster", {
        name: scenarioClusterData.name,
        id: scenarioClusterData.id,
        ...getStatusIfPresent(scenarioClusterData.status)
      });

      scenarioClusterData.services.forEach(scenarioClusterServiceData => {
        server.create("clusterService", {
          cluster: seededCluster,
          id: scenarioClusterServiceData.id,
          name: scenarioClusterServiceData.name,
          ...getStatusIfPresent(scenarioClusterServiceData.status),
          ...getFailedAtIfPresent(scenarioClusterServiceData.failedAt)
        });
      })
    })
  }
}

export function seedsFactory(scenario: MocksScenario) {
  switch (scenario) {
    case MocksScenario.scenario1:
      return generateSeedFromScenario(scenarioOneData);
    case MocksScenario.scenario2:
      return generateSeedFromScenario(scenarioTwoData);
  }
}