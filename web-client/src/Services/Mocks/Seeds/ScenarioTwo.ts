import {ScenarioCluster} from "./types";

export const scenarioTwoData: ScenarioCluster[] = [
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
    services: [
      {
        id: "cluster.service.two.one",
        name: "cluster service 2-1"
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
    id: "cluster.four",
    services: [
      {
        id: "cluster.service.four.one",
        name: "cluster service 4-1"
      },
      {
        id: "cluster.service.four.two",
        name: "cluster service 4-2"
      },
      {
        id: "cluster.service.four.three",
        name: "cluster service 4-3"
      }
    ]
  }
]