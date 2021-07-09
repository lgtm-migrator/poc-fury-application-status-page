import React, {useEffect} from "react";
import { ClusterStatus } from "../ClusterStatus";
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from "react-router-dom";
import 'fury-design-system/dist/eui_theme_fury_community.css';
import './Style.css';
import {ClusterServiceStatus} from "../ClusterServiceStatus";
import {LocalizedText} from "./LocalizedText";
import {initialize} from "../../i18n";

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
  useEffect(() => {
    initialize.then(() => {
      LocalizedText.singleton.changeLanguage(props.language);
    })
  }, []);

  return (
    <Router>
      <Switch>
        <Route path={`${props.basePath}/:clusterId/status`} component={(propsRoute: RouteComponentProps<RouteParams>) =>
          <ClusterServiceStatus
            apiUrl={props.apiUrl}
            releaseNumber={props.releaseNumber}
            language={props.language}
            clusterId={propsRoute.match.params.clusterId}
            basePath={props.basePath}
          />
        } />
        <Route
          path={`${props.basePath}/`}
          render={() => (
            <ClusterStatus
              apiUrl={props.apiUrl}
              releaseNumber={props.releaseNumber}
              language={props.language}
              basePath={props.basePath}
            />
          )}
        />
      </Switch>
    </Router>
  );
};

export default ApplicationStatusComponent;
