import {belongsTo, createServer, Factory, Model} from "miragejs"
import {BelongsTo} from "miragejs/-types";

interface MockedCluster {
  status: "healthy" | "error";
  name: string;
  id: string;
}

interface MockedClusterService {
  status: "healthy" | "error";
  name: string;
  cluster: BelongsTo<"cluster">;
}

export function makeServer({ environment = 'test' }, urlPrefix: string, apiPath?: string) {
  return createServer({
    environment,
    models: {
      cluster: Model.extend<Partial<MockedCluster>>({}),
      clusterService: Model.extend<Partial<MockedClusterService>>({
        cluster: belongsTo()
      }),
    },
    factories: {
      cluster: Factory.extend<Partial<MockedCluster>>({
        name: "Unit Name",
        status: "healthy",
        id: "Unit ID",
      }),
      clusterService: Factory.extend<Partial<MockedClusterService>>({
        status: "healthy",
        name: "cluster service"
      })
    },
    seeds(server) {
      const clusterOne = server.create("cluster", {
        name: "cluster one",
        id: "cluster.one",
      });
      server.create("clusterService", {
        cluster: clusterOne
      });
    },
    routes() {
      this.urlPrefix = urlPrefix;

      this.get("/config", () => {
        return {
          Data: {
            listener: "0.0.0.0:8080",
            externalEndpoint: urlPrefix,
            apiVersion: "/api/v0/",
            appEnv: "development",
          }
        }
      });

      // TODO: describe what's happening here
      if (apiPath) {
        this.namespace = "/api/v0/";
      }

      this.get('list', (schema) => {
        return schema.all("cluster").models;
      })

      this.get(':id/list', (schema, request) => {
        const clusterServices = schema.all("clusterService").models.find(clusterService => clusterService.cluster?.id === request.params.id);

        return {
          name: clusterServices?.name,
          status: clusterServices?.status
        } as MockedClusterService
      })
    },
  })
}