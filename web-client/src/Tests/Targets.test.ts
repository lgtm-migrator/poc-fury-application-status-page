import {TargetsStore} from "../Stores/Targets";
import {makeServer} from "../Services/Mocks/MakeServer";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../Services/Mocks/types";
import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {seedsFactory} from "../Services/Mocks/Seeds/Factory";
import {injectGlobalWithFetchJson} from "./Utils";
import {Target} from "../Components/types";
import {getAllHealthChecksByGroup} from "../Services/Mocks/io";

const url = "https://dummy.local";

function setMockedTargetsByGroup(
  server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>,
  groupLabel: string
) {
  const requestDataFromMocks = getAllHealthChecksByGroup(server.schema, groupLabel);

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

describe("Targets Store - scenario 1", () => {
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

  it("targetListGetAll()", async () => {
    const groupLabel = "BookInfo";
    const cascadeFailure = 1;
    const dummyTargetsStore = new TargetsStore(
      url,
      groupLabel,
      cascadeFailure
    )

    const expectedValue: Target[] = [
      {
        failedChecks: 0,
        status: "Complete",
        target: "Details",
        totalChecks: 6
      },
      {
        failedChecks: 0,
        status: "Complete",
        target: "Product",
        totalChecks: 6
      },
      {
        failedChecks: 1,
        status: "Failed",
        target: "Ratings",
        totalChecks: 4
      }
    ]

    setMockedTargetsByGroup(server, groupLabel);

    await dummyTargetsStore.targetListGetAll();

    expect(dummyTargetsStore.targetList).toStrictEqual(expectedValue);
  })
})

describe("Targets Store - scenario 2", () => {
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

  it("targetListGetAll()", async () => {
    const groupLabel = "BookInfo";
    const cascadeFailure = 1;
    const dummyTargetsStore = new TargetsStore(
      url,
      groupLabel,
      cascadeFailure
    )
    const expectedValue: Target[] = [
      {
        failedChecks: 0,
        status: "Complete",
        target: "Details",
        totalChecks: 6
      },
      {
        failedChecks: 0,
        status: "Complete",
        target: "Product",
        totalChecks: 6
      },
      {
        failedChecks: 0,
        status: "Complete",
        target: "Ratings",
        totalChecks: 4
      }
    ]

    setMockedTargetsByGroup(server, groupLabel);

    await dummyTargetsStore.targetListGetAll();

    expect(dummyTargetsStore.targetList).toStrictEqual(expectedValue);
  })
})
