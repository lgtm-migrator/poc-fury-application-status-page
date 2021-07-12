/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {ClusterStatus} from "../types";

interface ScenarioClusterServices {
  id: string;
  name: string;
  status?: ClusterStatus;
  failedAt?: string;
}

export interface ScenarioCluster {
  id: string;
  name: string;
  services: ScenarioClusterServices[];
  status?: ClusterStatus;
}
