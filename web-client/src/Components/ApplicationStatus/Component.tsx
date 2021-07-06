import React from "react";
import { ClusterStatus } from "../ClusterStatus";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'fury-design-system/dist/eui_theme_fury_community.css';

interface ApplicationStatusComponentProps {
  language: string;
  releaseNumber: string;
  basePath: string;
  apiUrl: string;
}

const ApplicationStatusComponent = (props: ApplicationStatusComponentProps) => {
  return (
    <Router>
      <Switch>
        <Route
          path={`${props.basePath}/`}
          render={() => (
            <ClusterStatus
              apiUrl={props.apiUrl}
              releaseNumber={props.releaseNumber}
              language={props.language}
            />
          )}
        />
        <Route path={`${props.basePath}/:id/status`} render={() => <></>} />
      </Switch>
    </Router>
  );
};

export default ApplicationStatusComponent;
