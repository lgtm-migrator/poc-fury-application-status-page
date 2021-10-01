/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { HealthCheckResponse, Target } from "../Components/types";
import HealthCheckHandler from "../Services/HealthCheckHandler";

export default class TargetsStore {
  public targetList: Target[] = [];

  constructor(
    private apiUrl: string,
    private groupLabel: string,
    private cascadeFailure: number
  ) {
    makeObservable(this, {
      targetList: observable,
      targetListGetAll: action,
    });
  }

  public async targetListGetAll() {
    const targetListJson = await this.fetchTargetListAsync();

    if (!targetListJson) throw new Error("targetList is undefined");

    const healthCheckHandler = new HealthCheckHandler(
      targetListJson.data,
      this.cascadeFailure
    );

    runInAction(() => {
      this.targetList = healthCheckHandler.groupByTarget();
    });
  }

  private async fetchTargetListAsync(): Promise<HealthCheckResponse> {
    const targetList = await fetch(`${this.apiUrl}lastChecks`);

    return targetList.json();
  }
}
