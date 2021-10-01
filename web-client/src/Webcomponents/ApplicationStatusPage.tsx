/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";
import ApplicationStatus from "../Components/ApplicationStatus/Container";

const ApplicationStatusPage = reactToWebComponent(
  ApplicationStatus,
  React,
  ReactDOM
);

export default ApplicationStatusPage;
