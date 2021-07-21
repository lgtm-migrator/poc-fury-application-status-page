import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../Services/Mocks/types";
import {makeServer} from "../Services/Mocks/MakeServer";
import {seedsFactory} from "../Services/Mocks/Seeds/Factory";
import {injectGlobalWithFetchJson} from "./Utils";
import {TargetHealthChecksStore} from "../Stores/TargetHealthChecks";
import {TargetHealthCheck} from "../Components/types";
import {getAllHealthChecksByGroupAndTarget} from "../Services/Mocks/io";

const url = "https://dummy.local";

function setMockedHealthChecksByTargetsAndGroup(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>, groupLabel: string, targetLabel: string) {
  const requestDataFromMocks = getAllHealthChecksByGroupAndTarget(server.schema, groupLabel, targetLabel);

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

describe("Target Health Checks Store - scenario 1", () => {
  let server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>;

  beforeEach(() => {
    server = makeServer(
      { environment: "test" },
      url,
      MocksScenario.scenario1,
      "/"
    )

    seedsFactory(MocksScenario.scenario1)(server);
  })

  afterEach(() => {
    server.shutdown();
  })

  it("targetHealthChecksListGetAll() - Ratings", async () => {
    const groupLabel = "BookInfo";
    const targetLabel = "Ratings";
    const dummyTargetHealthChecksStore = new TargetHealthChecksStore(
      url,
      groupLabel,
      targetLabel
    );

    const expectedValue: TargetHealthCheck[] = [
      {
        checkName: "service-endpoints-check",
        status: "Complete",
        target: "Ratings"
      },
      {
        checkName: "http-status-check",
        status: "Failed",
        target: "Ratings"
      }
    ];

    setMockedHealthChecksByTargetsAndGroup(server, groupLabel, targetLabel);

    await dummyTargetHealthChecksStore.targetHealthChecksListGetAll();

    expect(dummyTargetHealthChecksStore.targetHealthChecksList).toStrictEqual(expectedValue);
  })
})

describe("Target Health Checks Store - scenario 2", () => {
  let server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>;

  beforeEach(() => {
    server = makeServer(
      { environment: "test" },
      url,
      MocksScenario.scenario2,
      "/"
    )

    seedsFactory(MocksScenario.scenario2)(server);
  })

  afterEach(() => {
    server.shutdown();
  })

  it("targetHealthChecksListGetAll() - Details", async () => {
    const groupLabel = "BookInfo";
    const targetLabel = "Details";
    const dummyTargetHealthChecksStore = new TargetHealthChecksStore(
      url,
      groupLabel,
      targetLabel
    );

    const expectedValue: TargetHealthCheck[] = [
      {
        checkName: "service-endpoints-check",
        status: "Complete",
        target: "Details"
      },
      {
        checkName: "http-status-check",
        status: "Complete",
        target: "Details"
      }
    ];

    setMockedHealthChecksByTargetsAndGroup(server, groupLabel, targetLabel);

    await dummyTargetHealthChecksStore.targetHealthChecksListGetAll();

    expect(dummyTargetHealthChecksStore.targetHealthChecksList).toStrictEqual(expectedValue);
  })
})
