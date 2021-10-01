/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import { StateManager } from "fury-component/dist/State/types";
import { releaseNumber } from "../../constants";
import createStateHandler from "../../Services/createStateHandler";
import ApplicationStatusComponent from "./Component";
import makeServer from "../../Services/Mocks/MakeServer";
import { IStateHandler } from "../types";
import { MocksScenario } from "../../Services/Mocks/types";
import { ApplicationStatusContainerProps } from "./types";
import ApplicationContext from "./Context";

function getIsMocked(stateHandler: StateManager<IStateHandler>): boolean {
  if (stateHandler.getMocked) {
    return stateHandler.getMocked();
  }

  return process.env.SERVER_OFFLINE === "true";
}

function getBasePath(stateHandler: StateManager<IStateHandler>) {
  if (stateHandler.getBasePath) {
    return stateHandler.getBasePath();
  }

  return "";
}

function buildApplicationContext(stateHandler: StateManager<IStateHandler>) {
  return {
    language: stateHandler.getLanguage(),
    releaseNumber,
    basePath: getBasePath(stateHandler),
    apiUrl: stateHandler.getState().apiurl,
    cascadeFailure: stateHandler.getState().cascadefailure,
    groupLabel: stateHandler.getState().grouplabel,
    groupTitle: stateHandler.getState()?.grouptitle,
    targetLabel: stateHandler.getState()?.targetlabel,
    targetTitle: stateHandler.getState()?.targettitle,
  };
}

export default function ApplicationStatusContainer(
  props: ApplicationStatusContainerProps
) {
  const stateHandler = createStateHandler();
  const {
    apiUrl,
    groupLabel,
    groupTitle,
    cascadeFailure,
    targetLabel,
    targetTitle,
  } = props;

  if (apiUrl) {
    stateHandler.setState({
      apiurl: apiUrl,
      grouplabel: groupLabel,
      grouptitle: groupTitle,
      cascadefailure: cascadeFailure,
      targetlabel: targetLabel,
      targettitle: targetTitle,
    });
  }

  const isMocked = getIsMocked(stateHandler);
  const applicationContext = buildApplicationContext(stateHandler);

  if (isMocked) {
    makeServer(
      { environment: "development" },
      stateHandler.getState().apiurl,
      MocksScenario.scenario4
    );
  }

  return (
    <ApplicationContext.Provider value={applicationContext}>
      <ApplicationStatusComponent />
    </ApplicationContext.Provider>
  );
}
