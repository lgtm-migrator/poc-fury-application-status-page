import {createServer} from "miragejs"
import {seedsFactory} from "./Seeds";
import {getBaseFactories, getBaseModels} from "./Configuration";
import {getRoutes} from "./Routes";
import {MocksScenario} from "./types";

export function makeServer({ environment = 'test' }, scenario: MocksScenario = MocksScenario.scenario1, urlPrefix: string, apiPath?: string) {
  return createServer({
    environment,
    models: getBaseModels(),
    factories: getBaseFactories(),
    seeds: seedsFactory(scenario),
    routes: getRoutes(urlPrefix, apiPath)
  })
}
