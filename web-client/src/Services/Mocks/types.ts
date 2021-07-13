/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {FactoryDefinition, ModelDefinition, Registry} from "miragejs/-types";
import Schema from "miragejs/orm/schema";
import {HealthCheck} from "../../Components/types";

export interface MockedHealthCheck extends HealthCheck {}

export type MockedServerBaseModels = {
  healthCheck: ModelDefinition<MockedHealthCheck>;
}

export type MockedServerBaseFactories = {
  healthCheck: FactoryDefinition;
}

export enum MocksScenario {
  "scenario1",
  "scenario2"
}

export type MockedSchema = Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>
