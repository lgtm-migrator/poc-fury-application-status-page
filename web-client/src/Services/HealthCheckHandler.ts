import {IHealthCheck, Target, TargetHealthCheck} from "../Components/types";

export class HealthCheckHandler {
  constructor(private targetList: IHealthCheck[], private cascadeFailure: number = 0) {}

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

  public groupByCheckName(): TargetHealthCheck[] {
    // TODO: ADD completedAt logic on error more recent
    return this.targetList.reduce((targetAcc, currentTarget) => {
      const targetIndex = HealthCheckHandler.getCheckNameIndexInAccumulator(currentTarget, targetAcc);
      if (targetIndex !== -1 && currentTarget.status === "Failed") {
        targetAcc[targetIndex].status = "Failed";
      }

      if (targetIndex === -1) {
        targetAcc.push({
          status: currentTarget.status,
          checkName: currentTarget.checkName,
          target: currentTarget.target
        });
      }

      return targetAcc;
    }, [] as TargetHealthCheck[]);
  }

  public groupByTarget(): Target[] {
    const groupedByCheckName = this.groupByCheckName();

    return groupedByCheckName.reduce((targetAcc, currentTarget) => {
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
    }, [] as Target[]);
  }
}
