/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useContext, useState } from "react";
import ErrorsReportCardComponent from "./Component";
import withErrorWrapper from "../ErrorWrapper";
import ApplicationContext from "../ApplicationStatus/Context";
import ErrorsReportChecksStore from "../../Stores/ErrorsReportChecks";
import { ErrorsReportCardContainerProps } from "./types";

function ErrorsReportCardContainer(props: ErrorsReportCardContainerProps) {
  const appContextData = useContext(ApplicationContext);
  const { errorHealthCheckCountByDay, accordionOpen } = props;
  const [errorsReportChecksStore] = useState<ErrorsReportChecksStore>(
    new ErrorsReportChecksStore(
      appContextData.apiUrl,
      errorHealthCheckCountByDay.dayDate,
      errorHealthCheckCountByDay.dayDate.format("YYYY-MM-DD")
    )
  );

  return (
    <>
      {errorsReportChecksStore && (
        <ErrorsReportCardComponent
          accordionOpen={accordionOpen}
          errorsReportChecksStore={errorsReportChecksStore}
          errorHealthCheckCountByDay={errorHealthCheckCountByDay}
        />
      )}
    </>
  );
}

export default withErrorWrapper(ErrorsReportCardContainer);
