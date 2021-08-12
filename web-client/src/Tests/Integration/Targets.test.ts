import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../../Services/Mocks/types";
import {getAllHealthChecksByGroup} from "../../Services/Mocks/IO";
import {injectGlobalWithFetchJson} from "../Utils";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {seedsGenerator} from "../../Services/Mocks/Seeds/Generator";
import {TargetsStore} from "../../Stores/Targets";
import {Target} from "../../Components/types";

const url = "https://dummy.local";

function setMockedHealthChecksByGroup(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) {
  const requestDataFromMocks = getAllHealthChecksByGroup(server.schema);

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

describe("Target Store - scenario 1", () => {
  let server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>;

  beforeEach(() => {
    server = makeServer(
      { environment: "test" },
      url,
      MocksScenario.scenario1,
      "/"
    )

    seedsGenerator(MocksScenario.scenario1)(server);
  })

  afterEach(() => {
    server.shutdown();
  })

  it("targetListGetAll() - cascadeFailure 0", async () => {
    const groupLabel = "BookInfo";
    const cascadeFailure = 0;

    const dummyTargetHealthChecksStore = new TargetsStore(
      url,
      groupLabel,
      cascadeFailure
    );

    const expectedValue: Target[] = [
      {
        status: "Complete",
        target: "Details",
        failedChecks: 0,
        totalChecks: 2
      },
      {
        status: "Complete",
        target: "Product",
        failedChecks: 0,
        totalChecks: 2
      },
      {
        status: "Complete",
        target: "Ratings",
        failedChecks: 1,
        totalChecks: 2
      }
    ];

    setMockedHealthChecksByGroup(server);

    await dummyTargetHealthChecksStore.targetListGetAll()

    expect(dummyTargetHealthChecksStore.targetList).toEqual(expectedValue);
  })

  it("targetListGetAll() - cascadeFailure 1", async () => {
    const groupLabel = "BookInfo";
    const cascadeFailure = 1;

    const dummyTargetHealthChecksStore = new TargetsStore(
      url,
      groupLabel,
      cascadeFailure
    );

    const expectedValue: Target[] = [
      {
        status: "Failed",
        target: "Ratings",
        failedChecks: 1,
        totalChecks: 2
      },
      {
        status: "Complete",
        target: "Details",
        failedChecks: 0,
        totalChecks: 2
      },
      {
        status: "Complete",
        target: "Product",
        failedChecks: 0,
        totalChecks: 2
      }
    ];

    setMockedHealthChecksByGroup(server);

    await dummyTargetHealthChecksStore.targetListGetAll()

    expect(dummyTargetHealthChecksStore.targetList).toEqual(expectedValue);
  })
})

describe("Target Store - scenario 2", () => {
  let server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>;

  beforeEach(() => {
    server = makeServer(
      {environment: "test"},
      url,
      MocksScenario.scenario2,
      "/"
    )

    seedsGenerator(MocksScenario.scenario2)(server);
  })

  afterEach(() => {
    server.shutdown();
  })

  it("targetListGetAll() - cascadeFailure 1", async () => {
    const groupLabel = "BookInfo";
    const cascadeFailure = 1;

    const dummyTargetHealthChecksStore = new TargetsStore(
      url,
      groupLabel,
      cascadeFailure
    );

    const expectedValue: Target[] = [
      {
        status: "Complete",
        target: "Details",
        failedChecks: 0,
        totalChecks: 2
      },
      {
        status: "Complete",
        target: "Product",
        failedChecks: 0,
        totalChecks: 2
      },
      {
        status: "Complete",
        target: "Ratings",
        failedChecks: 0,
        totalChecks: 2
      }
    ];

    setMockedHealthChecksByGroup(server);

    await dummyTargetHealthChecksStore.targetListGetAll()

    expect(dummyTargetHealthChecksStore.targetList).toEqual(expectedValue);
  })
})
