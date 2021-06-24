/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import ReactDOM from "react-dom";
import FuryApplicationStatus from "../Components/FuryApplicationStatus";

import reactToWebComponent from "react-to-webcomponent";

const FuryApplicationStatusPage = reactToWebComponent(FuryApplicationStatus, React, ReactDOM);

export default FuryApplicationStatusPage;
