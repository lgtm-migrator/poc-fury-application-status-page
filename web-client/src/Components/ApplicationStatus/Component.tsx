/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect} from "react";
import { Targets } from "../Targets";
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from "react-router-dom";
import 'fury-design-system/dist/eui_theme_fury_community.css';
import './Style.css';
import {TargetHealthChecks} from "../TargetHealthChecks";
import {LocalizedText} from "./LocalizedText";
import {initialize} from "../../i18n";
import {ApplicationContext} from "./Container";

interface RouteParams {
  target: string;
}

export default function ApplicationStatusComponent() {
  const appContextData = useContext(ApplicationContext);
  
  useEffect(() => {
    initialize.then(() => {
      LocalizedText.singleton.changeLanguage(appContextData.language);
    })
  }, []);

  return (
    <Router>
      <Switch>
        <Route path={`${appContextData.basePath}/:target`} component={(propsRoute: RouteComponentProps<RouteParams>) =>
          <TargetHealthChecks target={propsRoute.match.params.target} />
        } />
        <Route
          path={`${appContextData.basePath}/`}
          render={() => (
            <Targets />
          )}
        />
      </Switch>
    </Router>
  );
}
