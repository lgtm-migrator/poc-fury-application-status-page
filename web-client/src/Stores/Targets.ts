import { action, makeObservable, observable } from 'mobx';
import {HealthCheck, HealthCheckResponse, Target} from "../Components/types";

export class TargetsStore {
  public targetList: Target[] = [];

  constructor(private apiUrl: string, private groupLabel: string, private cascadeFailure: number) {
    makeObservable(this, {
      targetList              : observable,
      targetListGetAll        : action,
    });
  }

  public async targetListGetAll() {
    const targetListJson = await this.fetchTargetListAsync();

    if(!targetListJson) throw new Error("targetList is undefined");

    this.targetList = this.groupByTarget(targetListJson);
  }

  private static getTargetIndexInAccumulator(target: HealthCheck, accumulator: Target[]): number {
    return accumulator.findIndex((checkTarget) => checkTarget.target === target.target);
  }

  private async fetchTargetListAsync(): Promise<HealthCheckResponse> {
    const targetList = await fetch(`${this.apiUrl}group/${this.groupLabel}`);

    return await targetList.json();
  }

  private calcNewAggregatedStatus(failedChecksCount: number, totalChecksCount: number) {
    if (this.cascadeFailure === 0) {
      return failedChecksCount === totalChecksCount ? "Failed" : "Complete";
    }

    return failedChecksCount >= this.cascadeFailure ? "Failed" : "Complete";
  }

  private updateAggregatedTargetData(aggregatedTarget: Target, currentTarget: HealthCheck): Target {
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

  private groupByTarget(targetList: HealthCheck[]): Target[] {
    return targetList.reduce((targetAcc, currentTarget) => {
      const targetIndex = TargetsStore.getTargetIndexInAccumulator(currentTarget, targetAcc);

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
    }, [] as Target[]);
  }
}
