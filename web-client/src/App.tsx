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
  const [groupTitle, setGroupTitle] = useState<string>('');

  useEffect(() => {
    // Bootstrap app state from async fetch config/serviceList
    fetchConfigFromEnvOrRemoteAsync()
      .then(config => {
        if (mockServer) {
          mockServer.shutdown();
        }

        setApiUrl(config.apiPath);
        setGroupLabel(config.groupLabel);

        logger.info(config.apiPath);

        if (config.groupTitle) {
          setGroupTitle(config.groupTitle);
        }
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
        { apiUrl && groupLabel ?
          <EuiErrorBoundary>
            <ApplicationStatus
              apiUrl={apiUrl}
              groupLabel={groupLabel}
              groupTitle={groupTitle}
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

function getGroupTitleIfExists(groupTitle?: string) {
 if (groupTitle) {
   return {
     groupTitle: groupTitle
   }
 }

 return {}
}

async function fetchConfigFromEnvOrRemoteAsync() {
  const apiPath: string = process.env.API_PATH ?? "/";
  const groupLabel: string | undefined = process.env.GROUP_LABEL;
  const groupTitle: string | undefined = process.env.GROUP_TITLE;
  const serverBasePath: string = process.env.SERVER_BASE_PATH ?? '';

  // INFO: Allow local development without backend server
  if (process.env.SERVER_OFFLINE === 'true') {
    if (!groupLabel) {
      throw new Error('Missing GROUP_LABEL from .env')
    }

    return {
      apiPath: `${serverBasePath}${apiPath}`,
      groupLabel: groupLabel,
      ...getGroupTitleIfExists(groupTitle)
    }
  }

  // INFO: fetch config from backend server
  const configRes = await fetch(`${ serverBasePath }/config`);
  const json = await configRes.json();
  return {
    apiPath: `${ json.Data.apiUrl }${ apiPath }`,
    groupLabel: json.Data.groupLabel,
    ...getGroupTitleIfExists(json.Data.groupTitle)
  };
}

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
