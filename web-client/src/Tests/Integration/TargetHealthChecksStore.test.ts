import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../../Services/Mocks/types";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {seedsGenerator} from "../../Services/Mocks/Seeds/Generator";
import {TargetHealthChecksStore} from "../../Stores/TargetHealthChecks";
import {TargetHealthCheck} from "../../Components/types";
import moment from "moment";
import {setMockedHealthChecksByTargetsAndGroup} from "../Utils";

const url = "https://dummy.local";



describe("Target Health Checks Store - scenario 1", () => {
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
        checkName: "http-status-check",
        status: "Failed",
        target: targetLabel,
        lastCheck: moment("2021-07-13T18:06:03Z"),
        lastIssue: moment("2021-07-13T18:06:03Z")
      },
      {
        checkName: "service-endpoints-check",
        status: "Complete",
        target: targetLabel,
        lastCheck: moment("2021-07-13T18:08:07Z"),
        lastIssue: undefined
      },
    ];

    setMockedHealthChecksByTargetsAndGroup(server, targetLabel);

    await dummyTargetHealthChecksStore.targetHealthChecksListGetAll();

    expect(dummyTargetHealthChecksStore.targetHealthChecksList).toEqual(expectedValue);
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

    seedsGenerator(MocksScenario.scenario2)(server);
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
        checkName: "http-status-check",
        status: "Complete",
        target: targetLabel,
        lastCheck: moment("2021-07-13T18:05:08Z"),
        lastIssue: undefined
      },
      {
        checkName: "service-endpoints-check",
        status: "Complete",
        target: targetLabel,
        lastCheck: moment("2021-07-13T18:08:07Z"),
        lastIssue: undefined
      },
    ];

    setMockedHealthChecksByTargetsAndGroup(server, targetLabel);

    await dummyTargetHealthChecksStore.targetHealthChecksListGetAll();

    expect(dummyTargetHealthChecksStore.targetHealthChecksList).toEqual(expectedValue);
  })
})
