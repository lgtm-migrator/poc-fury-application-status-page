import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels, MocksScenario} from "../../Services/Mocks/types";
import {getAllFailedHealthChecksByDay} from "../../Services/Mocks/IO";
import {injectGlobalWithFetchJson} from "../Utils";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {seedsGenerator} from "../../Services/Mocks/Seeds/Generator";
import {ErrorsReportChecksStore} from "../../Stores/ErrorsReportChecks";
import moment, {Moment} from "moment";
import {ErrorsReportCheck} from "../../Components/ErrorsReportCard/types";

const url = "https://dummy.local";

function setErrorsReportChecks(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>, day: string) {
  const requestDataFromMocks = getAllFailedHealthChecksByDay(server.schema, day).map((mockedData) => {
    return {
      completedAt: mockedData.completedAt,
      checkName: mockedData.checkName,
      target: mockedData.target
    }
  });

  return injectGlobalWithFetchJson(server, requestDataFromMocks);
}

describe("Errors Report Store - scenario 1", () => {
  let server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>;

  beforeEach(() => {
    server = makeServer(
      {environment: "test"},
      url,
      MocksScenario.scenario1,
      "/"
    )

    seedsGenerator(MocksScenario.scenario1)(server);
  })

  afterEach(() => {
    server.shutdown();
  })

  it("errorsReportChecksListGetAll()", async () => {
    const reportDay = moment("2021-07-13T18:06:03Z").utc();
    const formattedReportDay = reportDay.format("YYYY-MM-DD");
    const dummyErrorsReportChecksStore = new ErrorsReportChecksStore(url, reportDay, formattedReportDay);

    const expectedValue: ErrorsReportCheck[] = [
      {
        completedAt: reportDay,
        checkName: "http-status-check",
        target: "Ratings"
      }
    ];

    setErrorsReportChecks(server, formattedReportDay);

    await dummyErrorsReportChecksStore.errorsReportChecksListGetAll();

    expect(dummyErrorsReportChecksStore.errorsReportChecksList).toEqual(expectedValue);
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

  it("errorsReportChecksListGetAll()", async () => {
    const reportDay = moment("2021-07-13T18:06:03Z").utc();
    const formattedReportDay = reportDay.format("YYYY-MM-DD");
    const dummyErrorsReportChecksStore = new ErrorsReportChecksStore(url, reportDay, formattedReportDay);

    const expectedValue: ErrorsReportCheck[] = [];

    setErrorsReportChecks(server, formattedReportDay);

    await dummyErrorsReportChecksStore.errorsReportChecksListGetAll();

    expect(dummyErrorsReportChecksStore.errorsReportChecksList).toEqual(expectedValue);
  })
})
