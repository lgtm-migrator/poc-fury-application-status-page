import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../../Services/Mocks/types";
import {getAllFailedHealthCountByDay} from "../../Services/Mocks/IO";
import {injectGlobalWithFetchJson} from "../Utils";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {seedsGenerator} from "../../Services/Mocks/Seeds/Generator";
import {ErrorsReportStore} from "../../Stores/ErrorsReport";
import {ErrorHealthCheckCountByDay} from "../../Components/types";
import moment from "moment";

const url = "https://dummy.local";

function setErrorsReport(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) {
  const requestDataFromMocks = getAllFailedHealthCountByDay(server.schema);

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

describe("Errors Report Store - scenario 1", () => {
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

  it("errorsReportChecksCountListGetAll()", async () => {
    const dummyErrorsReportStore = new ErrorsReportStore(url);

    const expectedValue: ErrorHealthCheckCountByDay[] = [
      {
        dayDate: moment("2021-07-13T18:06:03Z"),
        count: 1
      }
    ];

    setErrorsReport(server);

    await dummyErrorsReportStore.errorsReportChecksCountListGetAll();

    expect(dummyErrorsReportStore.errorsReportChecksCountList).toEqual(expectedValue);
  })
})

describe("Errors Report Store - scenario 2", () => {
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

  it("errorsReportChecksCountListGetAll()", async () => {
    const dummyErrorsReportStore = new ErrorsReportStore(url);

    const expectedValue: ErrorHealthCheckCountByDay[] = [];

    setErrorsReport(server);

    await dummyErrorsReportStore.errorsReportChecksCountListGetAll();

    expect(dummyErrorsReportStore.errorsReportChecksCountList).toEqual(expectedValue);
  })
})
