/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import Schema from "miragejs/orm/schema";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels} from "./types";

export function getAllHealthChecksByGroup(
  schema: Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>,
) {
  return schema
    .all("healthCheck")
    .models
}

export function getAllHealthChecksByGroupAndTarget(
  schema: Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>,
  targetLabel: string
) {
  return schema
    .all("healthCheck")
    .models
    .filter(healthCheck => healthCheck.target === targetLabel);
}
