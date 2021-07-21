import Schema from "miragejs/orm/schema";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels} from "./types";

export function getAllHealthChecksByGroup(
  schema: Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>,
  groupLabel: string
) {
  return schema
    .all("healthCheck")
    .models
    .filter(healthCheck => healthCheck.group === groupLabel);
}

export function getAllHealthChecksByGroupAndTarget(
  schema: Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>,
  groupLabel: string,
  targetLabel: string
) {
  return schema
    .all("healthCheck")
    .models
    .filter(healthCheck => healthCheck.group === groupLabel && healthCheck.target === targetLabel);
}