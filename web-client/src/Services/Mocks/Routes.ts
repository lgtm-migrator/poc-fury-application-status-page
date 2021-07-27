/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import Schema from "miragejs/orm/schema";
import {Registry} from "miragejs/-types";
import {MockedSchema, MockedServerBaseFactories, MockedServerBaseModels} from "./types";
import {Request} from "miragejs";
import {getAllHealthChecksByGroup, getAllHealthChecksByGroupAndTarget} from "./io";

export function getRoutes(urlPrefix: string, apiPath?: string) {
 return function () {
   this.urlPrefix = urlPrefix;

   this.get("/config", () => {
     return {
       Data: {
         listener: "0.0.0.0:8080",
         externalEndpoint: urlPrefix,
         apiVersion: "",
         groupLabel: "BookInfo",
         groupTitle: "Book Info Application",
         cascadeFailure: 0,
         targetLabel: "",
         targetTitle: "",
         appEnv: "development",
       }
     }
   });

   // We defined a namespace here, if present it'll get prefixed to every route
   // EX: 'list' becomes '/api/v0/list'
   if (apiPath) {
     this.namespace = "/api/";
   }

   this.get('lastChecks', (schema: Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>) => {
     return {
       code: 200,
       data: getAllHealthChecksByGroup(schema) ?? [],
       errorMessage: ""
     }
   })

   this.get('lastChecksAndIssues/:target', (schema: MockedSchema, request: Request) => {
     return {
       code: 200,
       data: getAllHealthChecksByGroupAndTarget(schema, request.params.target) ?? [],
       errorMessage: ""
     }
   })

   // We defined a namespace here, if present it'll get prefixed to every route
   // EX: 'list' becomes '/api/v0/list'
   /*if (apiPath) {
     this.namespace = "/api/v0/";
   }

   this.get('group/:group', (schema: Schema<Registry<MockedServerBaseModels, MockedServerBaseFactories>>, request: Request) => {
     return getAllHealthChecksByGroup(schema, request.params.group) ?? [];
   })

   this.get('group/:group/target/:target', (schema: MockedSchema, request: Request) => {
     return getAllHealthChecksByGroupAndTarget(schema, request.params.group, request.params.target) ?? [];
   })*/
 }
}
