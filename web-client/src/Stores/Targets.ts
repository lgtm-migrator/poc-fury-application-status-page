import {action, makeObservable, observable, runInAction} from 'mobx';
import {HealthCheckResponse, Target} from "../Components/types";
import {HealthCheckHandler} from "../Services/HealthCheckHandler";

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

    const healthCheckHandler = new HealthCheckHandler(targetListJson, this.cascadeFailure)

    runInAction(() => {
      this.targetList = healthCheckHandler.groupByTarget();
    })
  }

  private async fetchTargetListAsync(): Promise<HealthCheckResponse> {
    const targetList = await fetch(`${this.apiUrl}group/${this.groupLabel}`);

    return await targetList.json();
  }
}
