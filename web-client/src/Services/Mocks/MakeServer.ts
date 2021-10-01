/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { createServer } from "miragejs";
import seedsGenerator from "./Seeds/Generator";
import { getBaseFactories, getBaseModels } from "./Configuration";
import getRoutes from "./Routes";
import { MocksScenario } from "./types";

export default function makeServer(
  { environment = "test" },
  urlPrefix: string,
  scenario: MocksScenario,
  apiPath?: string
) {
  return createServer({
    environment,
    models: getBaseModels(),
    factories: getBaseFactories(),
    seeds: seedsGenerator(scenario),
    routes: getRoutes(urlPrefix, apiPath),
  });
}
