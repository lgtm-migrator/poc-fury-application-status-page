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
import ApplicationContext from "../../Components/ApplicationStatus/Context";
import makeServer from "../../Services/Mocks/MakeServer";
import seedsGenerator from "../../Services/Mocks/Seeds/Generator";
import { Server } from "miragejs/server";
import { Registry } from "miragejs/-types";
import {
  MockedServerBaseFactories,
  MockedServerBaseModels,
  MocksScenario,
} from "../../Services/Mocks/types";
import TargetHealthChecksStore from "../../Stores/TargetHealthChecks";
import { setMockedHealthChecksByTargetsAndGroup } from "../Utils";
import TargetHealthChecksComponent from "../../Components/TargetHealthChecks/Component";

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

describe("TargetsHealthChecksComponent - Scenario 1", () => {
  let server: Server<
    Registry<MockedServerBaseModels, MockedServerBaseFactories>
  >;

  const applicationContext = {
    language: "EN",
    releaseNumber: "",
    basePath: url,
    apiUrl: url,
    cascadeFailure: 1,
    groupLabel: groupLabel,
  };

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

  it("Ratings", async () => {
    const targetLabel = "Ratings";

    const dummyTargetHealthChecksStore = new TargetHealthChecksStore(
      url,
      groupLabel,
      targetLabel
    );

    setMockedHealthChecksByTargetsAndGroup(server, targetLabel);

    act(() => {
      render(
        <ApplicationContext.Provider value={applicationContext}>
          <TargetHealthChecksComponent
            releaseNumber={"test"}
            targetHealthChecksStore={dummyTargetHealthChecksStore}
            target={targetLabel}
          />
        </ApplicationContext.Provider>
      );
    });

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i));

    expect(
      screen.getByText("1 check inside BookInfo Ratings have failed for:")
    ).toBeTruthy();
  });

  it("Details", async () => {
    const targetLabel = "Details";

    const dummyTargetHealthChecksStore = new TargetHealthChecksStore(
      url,
      groupLabel,
      targetLabel
    );

    setMockedHealthChecksByTargetsAndGroup(server, targetLabel);

    act(() => {
      render(
        <ApplicationContext.Provider value={applicationContext}>
          <TargetHealthChecksComponent
            releaseNumber={"test"}
            targetHealthChecksStore={dummyTargetHealthChecksStore}
            target={targetLabel}
          />
        </ApplicationContext.Provider>
      );
    });

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i));

    expect(
      screen.getByText("All the BookInfo Details checks are passed")
    ).toBeTruthy();
  });
});
