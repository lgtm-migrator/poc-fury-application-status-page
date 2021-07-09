import {ClusterStatus} from "../types";

interface ScenarioClusterServices {
  id: string;
  name: string;
  status?: ClusterStatus;
  failedAt?: string;
}

export interface ScenarioCluster {
  id: string;
  name: string;
  services: ScenarioClusterServices[];
  status?: ClusterStatus;
}
