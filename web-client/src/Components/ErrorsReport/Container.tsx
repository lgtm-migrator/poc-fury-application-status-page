/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */


import React, {useContext, useState} from "react";
import ErrorsReportComponent from "./Component";
import {withErrorWrapper} from "../ErrorWrapper";
import {ApplicationContext} from "../ApplicationStatus/Container";
import {ErrorsReportStore} from "../../Stores/ErrorsReport";

export default withErrorWrapper(ErrorsReportContainer);

function ErrorsReportContainer() {
  const appContextData = useContext(ApplicationContext);
  const pageName = "Errors Report";
  const [errorsReportStore] = useState<ErrorsReportStore>(new ErrorsReportStore(appContextData.apiUrl))

  return (
    <>
      {
        errorsReportStore &&
        <ErrorsReportComponent
          errorsReportStore={errorsReportStore}
          pageName={pageName}
        />
      }
    </>
  )
}
