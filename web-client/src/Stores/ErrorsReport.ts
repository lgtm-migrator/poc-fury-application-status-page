/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import {
  ErrorHealthCheckCountByDay,
  ErrorHealthCheckCountByDayResponse,
} from "../Components/types";

export default class ErrorsReportStore {
  public errorsReportChecksCountList: ErrorHealthCheckCountByDay[] = [];

  constructor(private apiUrl: string) {
    makeObservable(this, {
      errorsReportChecksCountList: observable,
      errorsReportChecksCountListGetAll: action,
    });
  }

  public async errorsReportChecksCountListGetAll() {
    const errorsReportChecksCountListJson =
      await this.fetchErrorsReportChecksCountListAsync();

    if (!errorsReportChecksCountListJson)
      throw new Error("errorsReportChecksList is undefined");

    // TODO remove map from there
    runInAction(() => {
      this.errorsReportChecksCountList =
        errorsReportChecksCountListJson.data.map((errorReportDataElem) => {
          return {
            ...errorReportDataElem,
            dayDate: moment(errorReportDataElem.dayDate),
          };
        });
    });
  }

  private async fetchErrorsReportChecksCountListAsync(): Promise<ErrorHealthCheckCountByDayResponse> {
    const errorsReportChecks = await fetch(`${this.apiUrl}lastFailedChecks`);

    return errorsReportChecks.json();
  }
}
