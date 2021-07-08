import {createServer} from "miragejs"
import {logger} from "../Logger";
import {seedsFactory} from "./Seeds";
import {getBaseFactories, getBaseModels} from "./Configuration";
import {getRoutes} from "./Routes";

export function makeServer({ environment = 'test' }, scenario: string = 'scenario1', urlPrefix: string, apiPath?: string) {
  return createServer({
    environment,
    models: getBaseModels(),
    factories: getBaseFactories(),
    seeds: seedsFactory(scenario),
    routes: getRoutes(urlPrefix, apiPath)
  })
}
