/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { Suspense } from "react";
import {EuiSpacer, EuiErrorBoundary, EuiEmptyPrompt, EuiLoadingSpinner} from "fury-design-system";
import "./i18n";

import logo from "./Assets/logo.svg";
import fury from "./Assets/logotype.svg";

const FuryApplicationStatus = React.lazy(() => import("./Components/FuryApplicationStatus"));

function App() {

  console.log("window vars", window?.FURY?.modules);
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
        <EuiErrorBoundary>
          <FuryApplicationStatus />
        </EuiErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
