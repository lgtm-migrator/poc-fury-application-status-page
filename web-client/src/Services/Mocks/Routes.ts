/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {MockedSchema} from "./types";
import {Request} from "miragejs";
import {
  getAllFailedHealthChecksByDay,
  getAllFailedHealthCountByDay,
  getAllHealthChecksByGroup,
  getAllHealthChecksByGroupAndTarget
} from "./IO";

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
         cascadeFailure: 1,
         targetLabel: "",
         targetTitle: "",
         appEnv: "development",
       }
     }
   });

   // We defined a namespace here, if present it'll get prefixed to every route
   // EX: 'list' becomes '/api/v0/list'
   if (apiPath) {
     this.namespace = "/api/v1/";
   }

   this.get('lastChecks', (schema: MockedSchema) => {
     return {
       data: getAllHealthChecksByGroup(schema) ?? [],
       errorMessage: ""
     }
   })

   this.get('lastChecksAndIssues/:target', (schema: MockedSchema, request: Request) => {
     return {
       data: getAllHealthChecksByGroupAndTarget(schema, request.params.target) ?? [],
       errorMessage: ""
     }
   })

   this.get('lastFailedChecks', (schema: MockedSchema) => {
      return {
        data: getAllFailedHealthCountByDay(schema),
        errorMessage: ""
      }
   })

   this.get('lastFailedChecks/day/:day', (schema: MockedSchema, request: Request) => {
     return {
       data: getAllFailedHealthChecksByDay(schema, request.params.day) ?? [],
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
