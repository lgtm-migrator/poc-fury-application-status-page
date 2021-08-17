/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {Moment} from "moment";
import {ErrorsReportChecksStore} from "../../Stores/ErrorsReportChecks";
import {ErrorHealthCheckCountByDay} from "../types";

export interface ErrorsReportCardContainerProps {
  accordionOpen?: boolean;
  errorHealthCheckCountByDay: ErrorHealthCheckCountByDay;
}

export interface ErrorsReportCardComponentProps {
  accordionOpen?: boolean;
  errorsReportChecksStore: ErrorsReportChecksStore;
  errorHealthCheckCountByDay: ErrorHealthCheckCountByDay;
}

export interface ErrorsReportCheck {
  completedAt: Moment;
  checkName: string;
  target: string;
}
