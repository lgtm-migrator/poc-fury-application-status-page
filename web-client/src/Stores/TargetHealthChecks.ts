/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { HealthCheckResponse, TargetHealthCheck } from "../Components/types";
import HealthCheckHandler from "../Services/HealthCheckHandler";

export default class TargetHealthChecksStore {
  public targetHealthChecksList: TargetHealthCheck[] = [];

  constructor(
    private apiUrl: string,
    private groupLabel: string,
    private targetLabel: string
  ) {
    makeObservable(this, {
      targetHealthChecksList: observable,
      targetHealthChecksListGetAll: action,
    });
  }

  public async targetHealthChecksListGetAll() {
    const targetHealthChecksListJson =
      await this.fetchTargetHealthChecksListAsync();

    if (!targetHealthChecksListJson)
      throw new Error("targetHealthChecksList is undefined");

    const healthCheckHandler = new HealthCheckHandler(
      targetHealthChecksListJson.data
    );

    runInAction(() => {
      this.targetHealthChecksList = healthCheckHandler.groupByCheckName();
    });
  }

  private async fetchTargetHealthChecksListAsync(): Promise<HealthCheckResponse> {
    const targetHealthChecks = await fetch(
      `${this.apiUrl}lastChecksAndIssues/${this.targetLabel}`
    );

    return targetHealthChecks.json();
  }
}
