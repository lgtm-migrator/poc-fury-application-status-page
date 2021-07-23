/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {createContext, useState} from "react";
import {releaseNumber} from "../../constants";
import {createStateHandler} from "../../Services/createStateHandler";
import ApplicationStatusComponent from "./Component";
import {logger} from "../../Services/Logger";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {StateManager} from "fury-component/dist/State/types";
import {Config, IStateHandler, Target, TargetHealthCheck} from "../types";
import {MocksScenario} from "../../Services/Mocks/types";
import {IApplicationContext, ApplicationStatusContainerProps} from "./types";

export const ApplicationContext = createContext<IApplicationContext>({
  language: "",
  releaseNumber: "",
  basePath: "",
  apiUrl: "",
  groupLabel: "",
  cascadeFailure: 1
});

export default function ApplicationStatusContainer(props: ApplicationStatusContainerProps) {
  const stateHandler = createStateHandler();

  if(props.apiUrl) {
    stateHandler.setState({
      apiurl: props.apiUrl,
      grouplabel: props.groupLabel,
      grouptitle: props.groupTitle,
      cascadefailure: props.cascadeFailure,
      targetlabel: props.targetLabel,
      targettitle: props.targetTitle
    })
  }

  const isMocked = getIsMocked(stateHandler);
  const applicationContext = buildApplicationContext(stateHandler);


  if (isMocked) {
    makeServer({ environment: "development" }, stateHandler.getState().apiurl, MocksScenario.scenario1)
  }

  return (
    <ApplicationContext.Provider value={applicationContext}>
      <ApplicationStatusComponent />
    </ApplicationContext.Provider>
  );
}

function buildApplicationContext(stateHandler: StateManager<IStateHandler>) {
  return {
    language: stateHandler.getLanguage(),
    releaseNumber: releaseNumber,
    basePath: getBasePath(stateHandler),
    apiUrl: stateHandler.getState().apiurl,
    cascadeFailure: stateHandler.getState().cascadefailure,
    groupLabel: stateHandler.getState().grouplabel,
    groupTitle: stateHandler.getState()?.grouptitle,
    targetLabel: stateHandler.getState()?.targetlabel,
    targetTitle: stateHandler.getState()?.targettitle
  }
}

function getBasePath(stateHandler: StateManager<IStateHandler>) {
  if (stateHandler.getBasePath) {
    return stateHandler.getBasePath();
  }

  return "";
}

function getIsMocked(stateHandler: StateManager<IStateHandler>): boolean {
  if (stateHandler.getMocked) {
    return stateHandler.getMocked();
  }

  return process.env.APP_ENV === "development";
}
