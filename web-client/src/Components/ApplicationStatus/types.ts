/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Config } from "../types";

export interface ApplicationStatusContainerProps
  extends Omit<Config, "apiUrl"> {
  apiUrl?: string;
}

export interface ApplicationStatusRouteParams {
  target: string;
}

export interface IApplicationContext {
  language: string;
  releaseNumber: string;
  basePath: string;
  apiUrl: string;
  cascadeFailure: number;
  groupLabel: string;
  groupTitle?: string;
  targetLabel?: string;
  targetTitle?: string;
}
