import {ScenarioCluster} from "./types";

export const scenarioOneData: ScenarioCluster[] = [
  {
    name: "cluster one",
    id: "cluster.one",
    services: [
      {
        id: "cluster.service.one",
        name: "cluster service 1-1"
      }
    ]
  },
  {
    name: "cluster two",
    id: "cluster.two",
    status: "error",
    services: [
      {
        status: "error",
        id: "cluster.service.two.one",
        name: "cluster service 2-1",
        failedAt: "08 July 2021 15:15:11 +0200"
      }
    ]
  },
  {
    name: "cluster three",
    id: "cluster.three",
    services: [
      {
        id: "cluster.service.three" ,
        name: "cluster service 3-1"
      }
    ]
  },
  {
    name: "cluster four",
    status: "error",
    id: "cluster.four",
    services: [
      {
        status: "error",
        id: "cluster.service.four.one",
        name: "cluster service 4-1",
        failedAt: "07 July 2021 15:15:11 +0200"
      },
      {
        status: "error",
        id: "cluster.service.four.two",
        name: "cluster service 4-2",
        failedAt: "09 July 2021 15:15:11 +0200"
      },
      {
        id: "cluster.service.four.three",
        name: "cluster service 4-3",
      }
    ]
  }
]