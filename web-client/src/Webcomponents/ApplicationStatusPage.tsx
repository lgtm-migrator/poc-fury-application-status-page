/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import ReactDOM from "react-dom";
import ApplicationStatus from "../Components/ApplicationStatus/Container";

import reactToWebComponent from "react-to-webcomponent";

const ApplicationStatusPage = reactToWebComponent(ApplicationStatus, React, ReactDOM);

export default ApplicationStatusPage;
