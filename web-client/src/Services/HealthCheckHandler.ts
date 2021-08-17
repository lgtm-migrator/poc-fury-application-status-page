/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {IHealthCheck, Target, TargetHealthCheck} from "../Components/types";
import moment from "moment";

export class HealthCheckHandler {
  constructor(private targetList: IHealthCheck[], private cascadeFailure: number = 0) {
  }

  private static getCheckNameIndexInAccumulator = (target: IHealthCheck, accumulator: TargetHealthCheck[]): number => {
    return accumulator.findIndex((checkTarget) => checkTarget.checkName === target.checkName && checkTarget.target === target.target);
  }

  private static getTargetIndexInAccumulator(target: TargetHealthCheck, accumulator: Target[]): number {
    return accumulator.findIndex((checkTarget) => checkTarget.target === target.target);
  }

  private calcNewAggregatedStatus(failedChecksCount: number, totalChecksCount: number) {
    if (this.cascadeFailure === 0) {
      return failedChecksCount === totalChecksCount ? "Failed" : "Complete";
    }

    return failedChecksCount >= this.cascadeFailure ? "Failed" : "Complete";
  }

  private updateAggregatedTargetData(aggregatedTarget: Target, currentTarget: TargetHealthCheck): Target {
    const failedChecksCount = currentTarget.status === "Failed" ? aggregatedTarget.failedChecks + 1 : aggregatedTarget.failedChecks;
    const totalChecksCount = aggregatedTarget.totalChecks + 1;
    const aggregatedStatus = this.calcNewAggregatedStatus(failedChecksCount, totalChecksCount);

    return {
      status: aggregatedStatus,
      target: aggregatedTarget.target,
      failedChecks: failedChecksCount,
      totalChecks: totalChecksCount
    };
  }

  private static updateAggregatedHealthCheckData(aggregatedHealthCheck: TargetHealthCheck, currentHealthCheck: IHealthCheck) {
    const parsedCheckDate = moment(currentHealthCheck.completedAt);

    const updatedLastIssue = currentHealthCheck.status === "Failed" && (
      !aggregatedHealthCheck.lastIssue ||
      parsedCheckDate.isSameOrAfter(aggregatedHealthCheck.lastIssue)
    ) ? parsedCheckDate : aggregatedHealthCheck.lastIssue;

    if (parsedCheckDate.isSameOrAfter(aggregatedHealthCheck.lastCheck)) {
      return {
        ...aggregatedHealthCheck,
        status: currentHealthCheck.status,
        lastCheck: parsedCheckDate,
        lastIssue: updatedLastIssue
      }
    }

    return {
      ...aggregatedHealthCheck,
      lastIssue: updatedLastIssue
    }
  }

  public groupByCheckName(): TargetHealthCheck[] {
    return this.targetList
      .reduce((targetAcc, currentTarget) => {
        const targetIndex = HealthCheckHandler.getCheckNameIndexInAccumulator(currentTarget, targetAcc);

        if (targetIndex === -1) {
          const aggregatedHealthCheck: TargetHealthCheck = {
            status: currentTarget.status,
            checkName: currentTarget.checkName,
            target: currentTarget.target,
            lastCheck: moment(currentTarget.completedAt),
            lastIssue: currentTarget.status === "Failed" ? moment(currentTarget.completedAt) : undefined
          };

          return [...targetAcc, aggregatedHealthCheck];
        }

        targetAcc[targetIndex] = HealthCheckHandler.updateAggregatedHealthCheckData(
          targetAcc[targetIndex],
          currentTarget
        );

        return targetAcc;
      }, [] as TargetHealthCheck[])
      .sort(sortHealthChecksByParam("checkName"))
  }

  public groupByTarget(): Target[] {
    const groupedByCheckName = this.groupByCheckName();

    return groupedByCheckName
      .reduce((targetAcc, currentTarget) => {
        const targetIndex = HealthCheckHandler.getTargetIndexInAccumulator(currentTarget, targetAcc);

        if (targetIndex === -1) {
          const aggregatedTarget: Target = this.updateAggregatedTargetData({
              status: currentTarget.status,
              target: currentTarget.target,
              failedChecks: 0,
              totalChecks: 0
            },
            currentTarget
          );

          return [...targetAcc, aggregatedTarget];
        }

        targetAcc[targetIndex] = this.updateAggregatedTargetData(targetAcc[targetIndex], currentTarget);
        return targetAcc;
      }, [] as Target[])
      .sort(sortHealthChecksByParam("target"))
  }
}


function sortHealthChecksByParam(param: "target" | "checkName") {
  return (a: Target & TargetHealthCheck, b: Target & TargetHealthCheck) => {
    if (a.status === "Failed" && b.status !== "Failed") return -1

    if (a.status === b.status) {
      if (a[param] < b[param]) {
        return -1
      } else {
        return 1
      }
    }

    return 1
  }
}
