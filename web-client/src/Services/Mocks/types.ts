import {AnyFactories, AnyModels, BelongsTo, FactoryDefinition, ModelDefinition, Registry} from "miragejs/-types";
import Schema from "miragejs/orm/schema";

export interface MockedCluster {
  status: "healthy" | "error";
  name: string;
  id: string;
}

export interface MockedClusterService {
  status: "healthy" | "error";
  name: string;
  cluster: BelongsTo<"cluster">;
  id: string;
}

export type MockedServerBaseModels = {
  cluster: ModelDefinition<MockedCluster>;
  clusterService: ModelDefinition<MockedClusterService>;
}

export type MockedServerBaseFactories = {
  cluster: FactoryDefinition;
  clusterService: FactoryDefinition;
}

export enum MocksScenario {
  "scenario1",
  "scenario2"
}

export type MockedSchema = Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>