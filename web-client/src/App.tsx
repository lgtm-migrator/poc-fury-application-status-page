/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {Suspense, useEffect, useState} from "react";
import {EuiEmptyPrompt, EuiLoadingSpinner} from "fury-design-system";
import {initialize} from "./i18n";
// import logo from "./Assets/logo.svg";
// import fury from "./Assets/logotype.svg";
import {makeServer} from "./Services/Mocks/MakeServer";
import {Server} from "miragejs/server";
import {logger} from "./Services/Logger";
import {MocksScenario} from "./Services/Mocks/types";
import {Config} from "./Components/types";

const mockServer: Server | undefined = injectMockServer();
const ApplicationStatus = React.lazy(async () => {
  await initialize;
  return import("./Components/ApplicationStatus").then((module) => ({
    default: module.ApplicationStatus,
  }));
});

export default function App() {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [groupLabel, setGroupLabel] = useState<string>('');
  const [groupTitle, setGroupTitle] = useState<string | undefined>();
  const [targetLabel, setTargetLabel] = useState<string | undefined>();
  const [targetTitle, setTargetTitle] = useState<string | undefined>();
  const [cascadeFailure, setCascadeFailure] = useState<number>(0);

  useEffect(() => {
    // Bootstrap app state from async fetch config/serviceList
    fetchConfigFromEnvOrBackendAsync()
      .then(config => {
        if (mockServer) {
          mockServer.shutdown();
        }

        setApiUrl(config.apiUrl);
        setGroupLabel(config.groupLabel);
        setCascadeFailure(config.cascadeFailure);
        setGroupTitle(config.groupTitle);
        setTargetLabel(config.targetLabel);
        setTargetTitle(config.targetTitle);
      });
  }, []);

  return (
    <div className="App kasper">
      <Suspense fallback={
        <EuiEmptyPrompt
          // Inline style as fallback to render the message for super slow networks
          title={<h2 style={{display: 'block', margin: '25% auto 0', textAlign: 'center'}}>Loading...</h2>}
          body={
            <EuiLoadingSpinner size="xl" />
          }
        />
      }>
        { apiUrl && groupLabel
          ?
          <ApplicationStatus
            apiUrl={apiUrl}
            groupLabel={groupLabel}
            groupTitle={groupTitle}
            cascadeFailure={cascadeFailure}
            targetLabel={targetLabel}
            targetTitle={targetTitle}
          />
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

async function fetchConfigFromEnvOrBackendAsync(): Promise<Config> {
  const apiPath: string = process.env.API_PATH ?? "/";
  const serverBasePath: string = process.env.SERVER_BASE_PATH ?? '';

  return await getConfigFromBackend(serverBasePath, apiPath);
}

async function getConfigFromBackend(serverBasePath: string, apiPath: string): Promise<Config> {
  const configRes = await fetch(`${ serverBasePath }/config`);
  const json = await configRes.json();

  return {
    apiUrl: `${serverBasePath}${apiPath}`,
    groupLabel: json.Data.groupLabel,
    cascadeFailure: json.Data.cascadeFailure,
    groupTitle: json.Data.groupTitle,
    targetLabel: json.Data.targetLabel,
    targetTitle: json.Data.targetTitle
  };
}

function injectMockServer() {
  if (process.env.SERVER_OFFLINE === "true") {
    logger.info('creating mock server')
    return makeServer(
      { environment: "development" },
      process.env.SERVER_BASE_PATH ?? "",
      MocksScenario.scenario4,
      process.env.API_PATH ?? ""
    );
  }
}
