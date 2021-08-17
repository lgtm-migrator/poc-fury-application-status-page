/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels} from "../Services/Mocks/types";
import {
  getAllFailedHealthChecksByDay,
  getAllFailedHealthCountByDay,
  getAllHealthChecksByGroup,
  getAllHealthChecksByGroupAndTarget
} from "../Services/Mocks/IO";

export function setMockedHealthChecksByGroup(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) {
  const requestDataFromMocks = getAllHealthChecksByGroup(server.schema);

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

export function setMockedHealthChecksByTargetsAndGroup(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>, targetLabel: string) {
  const requestDataFromMocks = getAllHealthChecksByGroupAndTarget(server.schema, targetLabel);

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

export function setErrorsReport(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) {
  const requestDataFromMocks = getAllFailedHealthCountByDay(server.schema);

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

export function setErrorsReportChecks(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>, day: string) {
  const requestDataFromMocks = getAllFailedHealthChecksByDay(server.schema, day).map((mockedData) => {
    return {
      completedAt: mockedData.completedAt,
      checkName: mockedData.checkName,
      target: mockedData.target
    }
  });

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

// Inject the global node object to polyfill the fetch (client side only) function
function injectGlobalWithFetchJson(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>, data: any) {
  // @ts-ignore
  globalThis.fetch = jest.fn(() => Promise.resolve(
    {
      json: () => Promise.resolve({
        data: data
      })
    })
  )
}
