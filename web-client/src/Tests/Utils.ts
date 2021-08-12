import {Server} from "miragejs/server";
import {Registry} from "miragejs/-types";
import {MockedServerBaseFactories, MockedServerBaseModels} from "../Services/Mocks/types";

// Inject the global node object to polyfill the fetch (client side only) function
export function injectGlobalWithFetchJson(server: Server<Registry<MockedServerBaseModels, MockedServerBaseFactories>>, data: any) {
  // @ts-ignore
  globalThis.fetch = jest.fn(() => Promise.resolve(
    {
      json: () => Promise.resolve({
        data: data
      })
    })
  )
}
