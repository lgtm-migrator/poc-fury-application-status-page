import {TargetsStore} from "../Stores/Targets";
import {makeServer} from "../Services/Mocks/MakeServer";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../Services/Mocks/types";
import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {seedsFactory} from "../Services/Mocks/Seeds/Factory";
import {injectGlobalWithFetchJson} from "./Utils";
import {Target} from "../Components/types";

describe("Targets Store - scenario 1", () => {
  const url = "https://dummy.local";
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
    const requestDataFromMocks = server.schema.all("healthCheck").models;
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

    injectGlobalWithFetchJson(server, requestDataFromMocks);

    await dummyTargetsStore.targetListGetAll();

    expect(dummyTargetsStore.targetList).toStrictEqual(expectedValue);
  })
})



