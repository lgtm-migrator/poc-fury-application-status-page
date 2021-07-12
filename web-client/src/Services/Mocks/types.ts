/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {BelongsTo, FactoryDefinition, ModelDefinition, Registry} from "miragejs/-types";
import Schema from "miragejs/orm/schema";

export type ClusterStatus = "healthy" | "error";

export interface MockedCluster {
  status: ClusterStatus;
  name: string;
  id: string;
}

export interface MockedClusterService {
  status: ClusterStatus;
  name: string;
  cluster: BelongsTo<"cluster">;
  id: string;
  failedAt: string;
}

export type MockedServerBaseModels = {
  cluster: ModelDefinition<MockedCluster>;
  clusterService: ModelDefinition<MockedClusterService>;
}

export type MockedServerBaseFactories = {
  cluster: FactoryDefinition;
  clusterService: FactoryDefinition;
}

export enum MocksScenario {
  "scenario1",
  "scenario2"
}

export type MockedSchema = Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>
