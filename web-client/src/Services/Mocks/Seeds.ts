import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "./types";

function getScenarioOneSeeds(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) {
  const clusterOne = server.create("cluster", {
    name: "cluster one",
    id: "cluster.one",
  });
  server.create("clusterService", {
    cluster: clusterOne,
    id: "cluster.service.one"
  });
  const clusterTwo = server.create("cluster", {
    name: "cluster two",
    status: "error",
    id: "cluster.two",
  });
  server.create("clusterService", {
    cluster: clusterTwo,
    status: "error",
    id: "cluster.service.two.one",
    name: "cluster service 2-1"
  });
  const clusterThree = server.create("cluster", {
    name: "cluster three",
    id: "cluster.three",
  });
  server.create("clusterService", {
    cluster: clusterThree,
    id: "cluster.service.three"
  });
  const clusterFour = server.create("cluster", {
    name: "cluster four",
    status: "error",
    id: "cluster.four",
  });
  server.create("clusterService", {
    cluster: clusterFour,
    status: "error",
    id: "cluster.service.four.one",
    name: "cluster service 4-1"
  });
  server.create("clusterService", {
    cluster: clusterFour,
    status: "error",
    id: "cluster.service.four.two",
    name: "cluster service 4-2"
  });
  server.create("clusterService", {
    cluster: clusterFour,
    id: "cluster.service.four.three",
    name: "cluster service 4-3"
  });
}

function getScenarioTwoSeeds(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) {
  const clusterOne = server.create("cluster", {
    name: "cluster one",
    id: "cluster.one",
  });
  server.create("clusterService", {
    cluster: clusterOne,
    id: "cluster.service.one"
  });
  const clusterTwo = server.create("cluster", {
    name: "cluster two",
    id: "cluster.two",
  });
  server.create("clusterService", {
    cluster: clusterTwo,
    id: "cluster.service.two.one",
    name: "cluster service 2-1"
  });
  const clusterThree = server.create("cluster", {
    name: "cluster three",
    id: "cluster.three",
  });
  server.create("clusterService", {
    cluster: clusterThree,
    id: "cluster.service.three"
  });
  const clusterFour = server.create("cluster", {
    name: "cluster four",
    id: "cluster.four",
  });
  server.create("clusterService", {
    cluster: clusterFour,
    id: "cluster.service.four.one",
    name: "cluster service 4-1"
  });
  server.create("clusterService", {
    cluster: clusterFour,
    id: "cluster.service.four.two",
    name: "cluster service 4-2"
  });
  server.create("clusterService", {
    cluster: clusterFour,
    id: "cluster.service.four.three",
    name: "cluster service 4-3"
  });
}

export function seedsFactory(scenario: MocksScenario) {
  switch (scenario) {
    case MocksScenario.scenario1:
      return getScenarioOneSeeds
    case MocksScenario.scenario2:
      return getScenarioTwoSeeds
  }
}