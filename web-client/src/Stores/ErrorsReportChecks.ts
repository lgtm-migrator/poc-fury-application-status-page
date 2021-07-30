import {action, makeObservable, observable, runInAction} from "mobx";
import moment from "moment";
import {ErrorsReportCheck} from "../Components/ErrorsReportCard/types";
import {HealthCheckResponse} from "../Components/types";

export class ErrorsReportChecksStore {
  public errorsReportChecksList: ErrorsReportCheck[] | undefined = undefined;

  constructor(private apiUrl: string, private day: moment.Moment, public id: string) {
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
          completedAt: moment(errorReportDataElem.completedAt)
        }
      });
    })
  }

  private async fetchErrorsReportChecksListAsync(): Promise<HealthCheckResponse> {
    const errorsReportChecks = await fetch(`${this.apiUrl}lastFailedChecks/day/${this.day.format("")}`);

    return await errorsReportChecks.json();
  }
}
