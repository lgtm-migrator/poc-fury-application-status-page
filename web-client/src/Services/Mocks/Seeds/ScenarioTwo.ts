/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {MockedHealthCheck} from "../types";

export const scenarioTwoData: MockedHealthCheck[] = [
  {
    group: "BookInfo",
    target: "Details",
    startTime: "2021-07-13T18:06:03Z",
    completedAt: "2021-07-13T18:06:06Z",
    duration: "3s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-details-1626199560-v568g",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Details",
    startTime: "2021-07-13T18:07:04Z",
    completedAt: "2021-07-13T18:07:06Z",
    duration: "2s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-details-1626199620-zdljf",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Details",
    startTime: "2021-07-13T18:08:04Z",
    completedAt: "2021-07-13T18:08:07Z",
    duration: "3s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-details-1626199680-s4jrs",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Product",
    startTime: "2021-07-13T18:06:03Z",
    completedAt: "2021-07-13T18:06:05Z",
    duration: "2s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-product-1626199560-kps9w",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Product",
    startTime: "2021-07-13T18:07:04Z",
    completedAt: "2021-07-13T18:07:06Z",
    duration: "2s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-product-1626199620-x2gjd",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Product",
    startTime: "2021-07-13T18:08:05Z",
    completedAt: "2021-07-13T18:08:07Z",
    duration: "2s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-product-1626199680-xzq7r",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Ratings",
    startTime: "2021-07-13T18:06:03Z",
    completedAt: "2021-07-13T18:06:05Z",
    duration: "2s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-ratings-1626199560-zgddn",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Ratings",
    startTime: "2021-07-13T18:07:04Z",
    completedAt: "2021-07-13T18:07:06Z",
    duration: "2s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-ratings-1626199620-hgvnv",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Ratings",
    startTime: "2021-07-13T18:08:05Z",
    completedAt: "2021-07-13T18:08:07Z",
    duration: "2s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "ep-check-ratings-1626199680-qdfr5",
    checkName: "service-endpoints-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Details",
    startTime: "2021-07-13T17:55:07Z",
    completedAt: "2021-07-13T17:55:13Z",
    duration: "6s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "http-check-details-1626198900-zvccm",
    checkName: "http-status-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Details",
    startTime: "2021-07-13T18:00:00Z",
    completedAt: "2021-07-13T18:00:05Z",
    duration: "5s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "http-check-details-1626199200-7qjqx",
    checkName: "http-status-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Details",
    startTime: "2021-07-13T18:05:03Z",
    completedAt: "2021-07-13T18:05:08Z",
    duration: "5s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "http-check-details-1626199500-qxsbt",
    checkName: "http-status-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Product",
    startTime: "2021-07-13T17:55:07Z",
    completedAt: "2021-07-13T17:55:12Z",
    duration: "5s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "http-check-product-1626198900-w2xtj",
    checkName: "http-status-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Product",
    startTime: "2021-07-13T18:00:00Z",
    completedAt: "2021-07-13T18:00:05Z",
    duration: "5s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "http-check-product-1626199200-pc447",
    checkName: "http-status-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Product",
    startTime: "2021-07-13T18:05:03Z",
    completedAt: "2021-07-13T18:05:09Z",
    duration: "6s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "http-check-product-1626199500-ptc2s",
    checkName: "http-status-check",
    owner: "healthcheck-controller",
    error: "",
  },
  {
    group: "BookInfo",
    target: "Ratings",
    startTime: "2021-07-13T18:05:03Z",
    completedAt: "2021-07-13T18:06:03Z",
    duration: "60s",
    status: "Complete",
    namespace: "bookinfo",
    podName: "",
    checkName: "http-status-check",
    owner: "healthcheck-controller",
    error: "",
  },
];
