import React, {PropsWithChildren} from "react";
import { ClusterStatus } from "../ClusterStatus";
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from "react-router-dom";
import 'fury-design-system/dist/eui_theme_fury_community.css';
import './Style.css';
import {ClusterServiceStatus} from "../ClusterServiceStatus";

interface RouteParams {
  clusterId: string;
}

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
        <Route path={`${props.basePath}/:clusterId/status`} component={(propsRoute: RouteComponentProps<RouteParams>) =>
          <ClusterServiceStatus
            apiUrl={props.apiUrl}
            releaseNumber={props.releaseNumber}
            language={props.language}
            clusterId={propsRoute.match.params.clusterId}
          />
        } />
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
      </Switch>
    </Router>
  );
};

export default ApplicationStatusComponent;
