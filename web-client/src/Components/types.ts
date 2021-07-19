/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

export interface IStateHandler {
  apiurl: string;
  cascadefailure: number;
  grouplabel: string;
  grouptitle?: string;
  targetlabel?: string;
  targettitle?: string;
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

export type HealthCheckResponse = HealthCheck[];

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

export interface Config {
  apiUrl: string;
  cascadeFailure: number;
  groupLabel: string;
  groupTitle?: string;
  targetLabel?: string;
  targetTitle?: string;
}
