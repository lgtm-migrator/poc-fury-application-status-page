/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {logger} from "../Logger";
import Schema from "miragejs/orm/schema";
import {Registry} from "miragejs/-types";
import {MockedSchema, MockedServerBaseFactories, MockedServerBaseModels} from "./types";
import {Request} from "miragejs";

export function getRoutes(urlPrefix: string, apiPath?: string) {
 return function () {
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

   // We defined a namespace here, if present it'll get prefixed to every route
   // EX: 'list' becomes '/api/v0/list'
   if (apiPath) {
     this.namespace = "/api/v0/";
   }

   this.get('list', (schema: Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) => {
     return schema.all("cluster").models;
   })

   this.get(':clusterId/list', (schema: MockedSchema, request: Request) => {
     const clusterServices = schema.all("clusterService").models.filter(clusterService => clusterService.cluster?.id === request.params.clusterId);
     logger.info(JSON.stringify(clusterServices));
     return clusterServices;
   })
 }
}
