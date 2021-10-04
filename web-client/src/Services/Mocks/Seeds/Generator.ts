/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Server } from "miragejs/server";
import { Registry } from "miragejs/-types";
import {
  MockedHealthCheck,
  MockedServerBaseFactories,
  MockedServerBaseModels,
  MocksScenario,
} from "../types";
import scenarioOneData from "./ScenarioOne";
import scenarioTwoData from "./ScenarioTwo";
import scenarioThreeData from "./ScenarioThree";
import scenarioFourData from "./ScenarioFour";

function generateSeedFromScenario(scenarioData: MockedHealthCheck[]) {
  return function generator(
    server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>
  ) {
    scenarioData.forEach((scenarioClusterData) => {
      server.create("healthCheck", {
        ...scenarioClusterData,
      });
    });
  };
}

export default function seedsGenerator(scenario: MocksScenario) {
  switch (scenario) {
    case MocksScenario.scenario1:
      return generateSeedFromScenario(scenarioOneData);
    case MocksScenario.scenario2:
      return generateSeedFromScenario(scenarioTwoData);
    case MocksScenario.scenario3:
      return generateSeedFromScenario(scenarioThreeData);
    case MocksScenario.scenario4:
      return generateSeedFromScenario(scenarioFourData);
    default:
      return generateSeedFromScenario(scenarioOneData);
  }
}
