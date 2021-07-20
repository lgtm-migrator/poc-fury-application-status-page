import { action, makeObservable, observable } from 'mobx';
import {HealthCheck, HealthCheckResponse, TargetHealthCheck} from "../Components/types";

export class TargetHealthChecksStore {
  public targetHealthChecksList: TargetHealthCheck[] = [];

  constructor(private apiUrl: string, private groupLabel: string, private targetLabel: string) {
    makeObservable(this, {
      targetHealthChecksList: observable,
      targetHealthChecksListGetAll: action,
    });
  }

  public async targetHealthChecksListGetAll() {
    const targetHealthChecksListJson = await this.fetchTargetHealthChecksListAsync();

    if(!targetHealthChecksListJson) throw new Error("targetHealthChecksList is undefined");

    this.targetHealthChecksList = this.groupByCheckName(targetHealthChecksListJson);
  }

  private async fetchTargetHealthChecksListAsync(): Promise<HealthCheckResponse> {
    const targetHealthChecks = await fetch(`${this.apiUrl}group/${this.groupLabel}/target/${this.targetLabel}`);

    return await targetHealthChecks.json();
  }

  private static getTargetIndexInAccumulator = (target: HealthCheck, accumulator: TargetHealthCheck[]): number => {
    return accumulator.findIndex((checkTarget) => checkTarget.checkName === target.checkName);
  }

  private groupByCheckName(targetList: HealthCheck[]): TargetHealthCheck[] {
    // TODO: ADD completedAt logic on error more recent
    return targetList.reduce((targetAcc, currentTarget) => {
      const targetIndex = TargetHealthChecksStore.getTargetIndexInAccumulator(currentTarget, targetAcc);
      if (targetIndex !== -1 && currentTarget.status === "Failed") {
        targetAcc[targetIndex].status = "Failed";
      }

      if (targetIndex === -1) {
        targetAcc.push({
          status: currentTarget.status,
          checkName: currentTarget.checkName
        });
      }

      return targetAcc;
    }, [] as TargetHealthCheck[]);
  }
}
