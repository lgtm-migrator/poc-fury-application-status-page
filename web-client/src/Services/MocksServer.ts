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
  id: string;
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
        name: "cluster service",
        id: "Cluster Service ID"
      })
    },
    seeds(server) {
      const clusterOne = server.create("cluster", {
        name: "cluster one",
        id: "cluster.one",
      });
      server.create("clusterService", {
        cluster: clusterOne,
        id: "cluster.service.one"
      });
      const clusterTwo = server.create("cluster", {
        name: "cluster two",
        id: "cluster.two",
      });
      server.create("clusterService", {
        cluster: clusterTwo,
        id: "cluster.service.two"
      });
      const clusterThree = server.create("cluster", {
        name: "cluster three",
        id: "cluster.three",
      });
      server.create("clusterService", {
        cluster: clusterThree,
        id: "cluster.service.three"
      });
      const clusterFour = server.create("cluster", {
        name: "cluster four",
        id: "cluster.four",
      });
      server.create("clusterService", {
        cluster: clusterFour,
        id: "cluster.service.four"
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

      this.get(':clusterId/list', (schema, request) => {
        const clusterServices = schema.all("clusterService").models.find(clusterService => clusterService.cluster?.id === request.params.clusterId);

        return [{
          name: clusterServices?.name,
          id: clusterServices?.id,
          status: clusterServices?.status
        } as MockedClusterService]
      })
    },
  })
}