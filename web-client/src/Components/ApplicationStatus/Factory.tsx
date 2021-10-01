/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import ApplicationContext from "./Context";
import TargetHealthChecks from "../TargetHealthChecks";
import Targets from "../Targets";
import { ApplicationStatusRouteParams } from "./types";
import { logger } from "../../Services/Logger";
import ErrorsReport from "../ErrorsReport";

export default function ApplicationStatusRouterFactory() {
  const appContextData = useContext(ApplicationContext);

  logger.info(JSON.stringify(appContextData));

  if (appContextData.targetLabel) {
    const targetLabel = appContextData.targetLabel ?? "";

    return (
      <Router>
        <Switch>
          <Route
            path={`${appContextData.basePath}`}
            component={() => (
              <TargetHealthChecks
                target={targetLabel}
                targetTitle={appContextData.targetTitle}
                standalone
              />
            )}
          />
        </Switch>
      </Router>
    );
  }

  return (
    <Router>
      <Switch>
        <Route
          path={`${appContextData.basePath}/errors-report`}
          component={() => <ErrorsReport />}
        />
        <Route
          path={`${appContextData.basePath}/:target`}
          component={(
            propsRoute: RouteComponentProps<ApplicationStatusRouteParams>
          ) => <TargetHealthChecks target={propsRoute.match.params.target} />}
        />
        <Route
          path={`${appContextData.basePath}/`}
          component={() => <Targets />}
        />
      </Switch>
    </Router>
  );
}
