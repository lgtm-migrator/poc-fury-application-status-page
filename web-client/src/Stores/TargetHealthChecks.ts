import {action, makeObservable, observable, runInAction} from 'mobx';
import {HealthCheckResponse, TargetHealthCheck} from "../Components/types";
import {HealthCheckHandler} from "../Services/HealthCheckHandler";

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

    const healthCheckHandler = new HealthCheckHandler(targetHealthChecksListJson)

    runInAction(() => {
      this.targetHealthChecksList = healthCheckHandler.groupByCheckName();
    })
  }

  private async fetchTargetHealthChecksListAsync(): Promise<HealthCheckResponse> {
    const targetHealthChecks = await fetch(`${this.apiUrl}group/${this.groupLabel}/target/${this.targetLabel}`);

    return await targetHealthChecks.json();
  }
}
