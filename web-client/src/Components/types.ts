/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

export interface IStateHandler {
  apiurl: string;
  grouplabel: string;
  grouptitle?: string;
}

export type HealthCheckStatus = "Complete" | "Failed";

export interface HealthCheck {
  status: HealthCheckStatus;
  group: string;
  target: string;
  startTime: string;
  completedAt: string;
  duration: string;
  namespace: string;
  podName: string;
  owner: string;
  checkName: string;
  error: string;
}

export interface HealthCheckResponse {
  results: HealthCheck[];
}

export interface Target {
  status: HealthCheckStatus;
  target: string;
}

export interface TargetHealthCheck {
 completedAt?: string;
 checkName: string;
 status: HealthCheckStatus;
 error?: string;
}
