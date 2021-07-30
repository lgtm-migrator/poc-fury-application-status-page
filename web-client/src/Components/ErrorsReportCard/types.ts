import {Moment} from "moment";
import {ErrorsReportChecksStore} from "../../Stores/ErrorsReportChecks";
import {ErrorHealthCheckCountByDay} from "../types";

export interface ErrorsReportCardContainerProps {
  errorHealthCheckCountByDay: ErrorHealthCheckCountByDay;
}

export interface ErrorsReportCardComponentProps {
  errorsReportChecksStore: ErrorsReportChecksStore;
  errorHealthCheckCountByDay: ErrorHealthCheckCountByDay;
}

export interface ErrorsReportCheck {
  completedAt: Moment;
  checkName: string;
  target: string;
}
