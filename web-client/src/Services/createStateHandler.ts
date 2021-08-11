/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Factory } from "fury-component";
import { IStateHandler } from "../Components/types";
import { StateManager } from "fury-component/dist/State/types";
import { moduleKey } from "../constants";

export function createStateHandler(): StateManager<IStateHandler> {
  if (!moduleKey) {
    throw new Error("Missing MODULE_KEY from .env");
  }

  const stateHandler = Factory.state<IStateHandler>({
    // INFO: Required in local development, when is not used as a federated module
    defaultState: {
      apiurl: `${process.env.SERVER_BASE_PATH}${process.env.API_PATH}`,
      cascadefailure: 0,
      grouplabel: ''
    },
    defaultLanguage: "IT",
    moduleName: moduleKey,
  });

  if (!stateHandler.getState().apiurl) {
    throw new Error(
      `Missing apiurl from common state. Value: ${
        stateHandler.getState().apiurl
      }`
    );
  }

  return stateHandler;
}
