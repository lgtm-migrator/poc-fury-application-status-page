/**
 * @jest-environment jsdom
 */

/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import {act, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {ApplicationContext} from "../../Components/ApplicationStatus/Container";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {seedsGenerator} from "../../Services/Mocks/Seeds/Generator";
import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../../Services/Mocks/types";
import {ErrorsReportStore} from "../../Stores/ErrorsReport";
import {setErrorsReport} from "../Utils";
import ErrorsReportComponent from "../../Components/ErrorsReport/Component";

const url = "https://dummy.local";
const groupLabel = "BookInfo";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
  __esModule: true,
  useHistory: () => ({
    push: jest.fn(),
    createHref: jest.fn()
  })
}));

describe("ErrorsReportComponent - Scenario 1", () => {
  let server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>;

  const applicationContext = {
    language: "EN",
    releaseNumber: "",
    basePath: url,
    apiUrl: url,
    cascadeFailure: 1,
    groupLabel: groupLabel
  }

  beforeEach(() => {
    server = makeServer(
      {environment: "test"},
      url,
      MocksScenario.scenario1,
      "/"
    )

    seedsGenerator(MocksScenario.scenario1)(server);
  })

  afterEach(() => {
    server.shutdown();
  })

  it("correct rendering", async () => {
    const dummyErrorsReportStore = new ErrorsReportStore(url);

    setErrorsReport(server);

    act(() => {
      render(
        <ApplicationContext.Provider value={applicationContext}>
          <ErrorsReportComponent errorsReportStore={dummyErrorsReportStore}
                                 pageName={"Errors report"}/>
        </ApplicationContext.Provider>
      )
    })

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))

    expect(screen.getByText("13th July")).toBeTruthy();
  })
})
