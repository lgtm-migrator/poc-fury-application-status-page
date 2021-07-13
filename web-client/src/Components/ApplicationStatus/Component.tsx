/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useEffect} from "react";
import { Targets } from "../Targets";
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from "react-router-dom";
import 'fury-design-system/dist/eui_theme_fury_community.css';
import './Style.css';
import {TargetHealthChecks} from "../TargetHealthChecks";
import {LocalizedText} from "./LocalizedText";
import {initialize} from "../../i18n";

interface RouteParams {
  target: string;
}

interface ApplicationStatusComponentProps {
  language: string;
  releaseNumber: string;
  basePath: string;
  apiUrl: string;
  groupTitle?: string;
  groupLabel: string;
}

const ApplicationStatusComponent = (props: ApplicationStatusComponentProps) => {
  useEffect(() => {
    initialize.then(() => {
      LocalizedText.singleton.changeLanguage(props.language);
    })
  }, []);

  return (
    <Router>
      <Switch>
        <Route path={`${props.basePath}/:target`} component={(propsRoute: RouteComponentProps<RouteParams>) =>
          <TargetHealthChecks
            apiUrl={props.apiUrl}
            releaseNumber={props.releaseNumber}
            language={props.language}
            target={propsRoute.match.params.target}
            groupLabel={props.groupLabel}
            basePath={props.basePath}
          />
        } />
        <Route
          path={`${props.basePath}/`}
          render={() => (
            <Targets
              apiUrl={props.apiUrl}
              releaseNumber={props.releaseNumber}
              language={props.language}
              basePath={props.basePath}
              groupLabel={props.groupLabel}
            />
          )}
        />
      </Switch>
    </Router>
  );
};

export default ApplicationStatusComponent;
