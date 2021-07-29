import {
  ErrorHealthCheckCountByDay,
  ErrorHealthCheckCountByDayResponse,
} from "../Components/types";
import {action, makeObservable, observable, runInAction} from "mobx";
import moment from "moment";

export class ErrorsReportStore {
  public errorsReportChecksList: ErrorHealthCheckCountByDay[] = [];

  constructor(private apiUrl: string) {
    makeObservable(this, {
      errorsReportChecksList: observable,
      errorsReportChecksListGetAll: action,
    });
  }

  public async errorsReportChecksListGetAll() {
    const errorsReportChecksListJson = await this.fetchErrorsReportChecksListAsync();

    if(!errorsReportChecksListJson) throw new Error("errorsReportChecksList is undefined");

    // TODO remove map from there
    runInAction(() => {
      this.errorsReportChecksList = errorsReportChecksListJson.data.map((errorReportDataElem) => {
        return {
          ...errorReportDataElem,
          dayDate: moment(errorReportDataElem.dayDate)
        }
      });
    })
  }

  private async fetchErrorsReportChecksListAsync(): Promise<ErrorHealthCheckCountByDayResponse> {
    const errorsReportChecks = await fetch(`${this.apiUrl}lastFailedChecks`);

    return await errorsReportChecks.json();
  }
}
