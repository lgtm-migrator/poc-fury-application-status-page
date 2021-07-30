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
            errorsReportChecksStore={errorsReportChecksStore}
            errorHealthCheckCountByDay={props.errorHealthCheckCountByDay}
        />
      }
    </>
  )
}
