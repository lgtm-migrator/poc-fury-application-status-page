/**
 * @jest-environment jsdom
 */

/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// @ts-ignore
import React from "react";
import * as ReactRouterDom from "react-router-dom";
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TargetStatusComponent from "../../Components/Targets/Component";
import ApplicationContext from "../../Components/ApplicationStatus/Context";
import TargetsStore from "../../Stores/Targets";
import { setMockedHealthChecksByGroup } from "../Utils";
import { Server } from "miragejs/server";
import { Registry } from "miragejs/-types";
import {
  MockedServerBaseFactories,
  MockedServerBaseModels,
  MocksScenario,
} from "../../Services/Mocks/types";
import makeServer from "../../Services/Mocks/MakeServer";
import seedsGenerator from "../../Services/Mocks/Seeds/Generator";

const url = "https://dummy.local";
const groupLabel = "BookInfo";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
  __esModule: true,
  useHistory: () => ({
    push: jest.fn(),
    createHref: jest.fn(),
  }),
}));

describe("TargetsComponent - Scenario 1", () => {
  let server: Server<
    Registry<MockedServerBaseModels, MockedServerBaseFactories>
  >;

  beforeEach(() => {
    server = makeServer(
      { environment: "test" },
      url,
      MocksScenario.scenario1,
      "/"
    );

    seedsGenerator(MocksScenario.scenario1)(server);
  });

  afterEach(() => {
    server.shutdown();
  });

  it("CascadeFailure = 1", async () => {
    const cascadeFailure = 1;
    const applicationContext = {
      language: "EN",
      releaseNumber: "",
      basePath: url,
      apiUrl: url,
      cascadeFailure: cascadeFailure,
      groupLabel: groupLabel,
    };

    const dummyTargetsStore = new TargetsStore(url, groupLabel, cascadeFailure);

    setMockedHealthChecksByGroup(server);

    act(() => {
      render(
        <ApplicationContext.Provider value={applicationContext}>
          <TargetStatusComponent targetsStore={dummyTargetsStore} />
        </ApplicationContext.Provider>
      );
    });

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i));

    expect(screen.getByText("There's an issue with Ratings")).toBeTruthy();
  });

  it("CascadeFailure = 0", async () => {
    const cascadeFailure = 0;
    const applicationContext = {
      language: "EN",
      releaseNumber: "",
      basePath: url,
      apiUrl: url,
      cascadeFailure: cascadeFailure,
      groupLabel: groupLabel,
    };

    const dummyTargetHealthChecksStore = new TargetsStore(
      url,
      groupLabel,
      cascadeFailure
    );

    setMockedHealthChecksByGroup(server);

    act(() => {
      render(
        <ApplicationContext.Provider value={applicationContext}>
          <TargetStatusComponent targetsStore={dummyTargetHealthChecksStore} />
        </ApplicationContext.Provider>
      );
    });

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i));

    expect(
      screen.getByText("All BookInfo systems are fully operational")
    ).toBeTruthy();
  });
});
