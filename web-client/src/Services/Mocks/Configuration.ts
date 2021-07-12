/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {belongsTo, Factory, Model} from "miragejs";
import {MockedCluster, MockedClusterService, MockedServerBaseFactories, MockedServerBaseModels} from "./types";

export function getBaseModels(): MockedServerBaseModels {
  return {
    cluster: Model.extend<Partial<MockedCluster>>({}),
    clusterService: Model.extend<Partial<MockedClusterService>>({
      cluster: belongsTo()
    })
  }
}

export function getBaseFactories(): MockedServerBaseFactories {
  return {
    cluster: Factory.extend<Partial<MockedCluster>>({
      name: "Unit Name",
      status: "healthy",
      id: "Unit ID",
    }),
    clusterService: Factory.extend<Partial<MockedClusterService>>({
      status: "healthy",
      name: "cluster service",
      id: "Cluster Service ID"
    })
  }
}
