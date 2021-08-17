/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useState} from "react";
import ErrorsReportCardComponent from "./Component";
import {withErrorWrapper} from "../ErrorWrapper";
import {ApplicationContext} from "../ApplicationStatus/Container";
import {ErrorsReportChecksStore} from "../../Stores/ErrorsReportChecks";
import {ErrorsReportCardContainerProps} from "./types";

export default withErrorWrapper(ErrorsReportCardContainer);

function ErrorsReportCardContainer(props: ErrorsReportCardContainerProps) {
  const appContextData = useContext(ApplicationContext);
  const [errorsReportChecksStore] = useState<ErrorsReportChecksStore>(
    new ErrorsReportChecksStore(
      appContextData.apiUrl,
      props.errorHealthCheckCountByDay.dayDate,
      props.errorHealthCheckCountByDay.dayDate.format("YYYY-MM-DD")
    )
  )

  return (
    <>
      {
        errorsReportChecksStore &&
        <ErrorsReportCardComponent
          accordionOpen={props.accordionOpen}
          errorsReportChecksStore={errorsReportChecksStore}
          errorHealthCheckCountByDay={props.errorHealthCheckCountByDay}
        />
      }
    </>
  )
}
