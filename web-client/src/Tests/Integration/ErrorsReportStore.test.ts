/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../../Services/Mocks/types";
import {getAllFailedHealthCountByDay} from "../../Services/Mocks/IO";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {seedsGenerator} from "../../Services/Mocks/Seeds/Generator";
import {ErrorsReportStore} from "../../Stores/ErrorsReport";
import {ErrorHealthCheckCountByDay} from "../../Components/types";
import moment from "moment";
import {setErrorsReport} from "../Utils";

const url = "https://dummy.local";



describe("Errors Report Store - scenario 1", () => {
  let server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>;

  beforeEach(() => {
    server = makeServer(
      { environment: "test" },
      url,
      MocksScenario.scenario1,
      "/"
    )

    seedsGenerator(MocksScenario.scenario1)(server);
  })

  afterEach(() => {
    server.shutdown();
  })

  it("errorsReportChecksCountListGetAll()", async () => {
    const dummyErrorsReportStore = new ErrorsReportStore(url);

    const expectedValue: ErrorHealthCheckCountByDay[] = [
      {
        dayDate: moment("2021-07-13T18:06:03Z"),
        count: 1
      }
    ];

    setErrorsReport(server);

    await dummyErrorsReportStore.errorsReportChecksCountListGetAll();

    expect(dummyErrorsReportStore.errorsReportChecksCountList).toEqual(expectedValue);
  })
})

describe("Errors Report Store - scenario 2", () => {
  let server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>;

  beforeEach(() => {
    server = makeServer(
      {environment: "test"},
      url,
      MocksScenario.scenario2,
      "/"
    )

    seedsGenerator(MocksScenario.scenario2)(server);
  })

  afterEach(() => {
    server.shutdown();
  })

  it("errorsReportChecksCountListGetAll()", async () => {
    const dummyErrorsReportStore = new ErrorsReportStore(url);

    const expectedValue: ErrorHealthCheckCountByDay[] = [];

    setErrorsReport(server);

    await dummyErrorsReportStore.errorsReportChecksCountListGetAll();

    expect(dummyErrorsReportStore.errorsReportChecksCountList).toEqual(expectedValue);
  })
})
