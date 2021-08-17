/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {Factory, Model} from "miragejs";
import {
  MockedHealthCheck,
  MockedServerBaseFactories,
  MockedServerBaseModels
} from "./types";

export function getBaseModels(): MockedServerBaseModels {
  return {
    healthCheck: Model.extend<Partial<MockedHealthCheck>>({}),
  }
}

export function getBaseFactories(): MockedServerBaseFactories {
  return {
    healthCheck: Factory.extend<Partial<MockedHealthCheck>>({
      status: "Complete",
    }),
  }
}
