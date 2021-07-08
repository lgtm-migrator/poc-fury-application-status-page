/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {Suspense, useEffect, useState} from "react";
import {EuiEmptyPrompt, EuiErrorBoundary, EuiLoadingSpinner, EuiSpacer} from "fury-design-system";
import {initialize} from "./i18n";
import logo from "./Assets/logo.svg";
import fury from "./Assets/logotype.svg";
import {makeServer} from "./Services/Mocks/MakeServer";
import {Server} from "miragejs/server";
import {logger} from "./Services/Logger";
import {MocksScenario} from "./Services/Mocks/types";

const fetchApiPathFromEnvOrRemoteAsync = async () => {
  const apiPath: string | undefined = process.env.API_PATH;
  const serverBasePath: string = process.env.SERVER_BASE_PATH ?? '';

  // INFO: Allow local development without backend server
  if (process.env.SERVER_OFFLINE === 'true') {
    return `${ serverBasePath }${ apiPath }`;
  }

  if (!apiPath) {
    throw new Error('Missing API_PATH from .env');
  }

  // INFO: fetch config from backend server
  const configRes = await fetch(`${ serverBasePath }/config`);
  const json = await configRes.json();
  return `${ json.Data.externalEndpoint }${ apiPath }`;
};

function injectMockServer() {
  if (process.env.APP_ENV === "development") {
    logger.info('creating mock server')
    return makeServer(
      { environment: "development" },
      process.env.SERVER_BASE_PATH ?? "",
      MocksScenario.scenario1,
      process.env.API_PATH ?? ""
    );
  }
}

const ApplicationStatus = React.lazy(async () => {
  await initialize;
  return import("./Components/ApplicationStatus").then((module) => ({
    default: module.ApplicationStatus,
  }));
});

const mockServer: Server | undefined = injectMockServer();

function App() {
  const [apiUrl, setApiUrl] = useState<string>('');
  logger.info(JSON.stringify(process.env))
  useEffect(() => {
    // Bootstrap app state from async fetch config/serviceList
    fetchApiPathFromEnvOrRemoteAsync()
      .then(configApiUrl => {
        if (mockServer) {
          mockServer.shutdown();
        }

        setApiUrl(configApiUrl)
      });
  }, []);

  return (
    <div className="App">
      <Suspense fallback={
        <EuiEmptyPrompt
          // Inline style as fallback to render the message for super slow networks
          title={<h2 style={{display: 'block', margin: '25% auto 0', textAlign: 'center'}}>Loading...</h2>}
          body={
            <EuiLoadingSpinner size="xl" />
          }
        />
      }>
        <EuiSpacer size="xxl" />
        <div style={{ width: "120px", margin: "0 auto" }}>
          <img
            src={logo}
            style={{ width: "40px", margin: "0 auto", display: "block" }}
            alt=""
          />
          <img
            src={fury}
            style={{ width: "80px", margin: "20px auto 0", display: "block" }}
            alt=""
          />
        </div>
        <EuiSpacer size="xxl" />
        { apiUrl ?
          <EuiErrorBoundary>
            <ApplicationStatus
              apiUrl={apiUrl}
            />
          </EuiErrorBoundary>
          :
          <EuiEmptyPrompt
            // Inline style as fallback to render the message for super slow networks
            title={<h2 style={{display: 'block', margin: '25% auto 0', textAlign: 'center'}}>Loading...</h2>}
            body={
              <EuiLoadingSpinner size="xl"/>
            }
          />
        }
      </Suspense>
    </div>
  );
}

export default App;
