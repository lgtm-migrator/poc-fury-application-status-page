/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { TargetHealthCheck } from "../../Components/types";
import TargetHealthChecksStore from "../../Stores/TargetHealthChecks";

export interface TargetHealthChecksContainerProps {
  target: string;
  targetTitle?: string;
  standalone?: boolean;
}

export interface TargetHealthChecksComponentProps {
  releaseNumber: string;
  targetHealthChecksStore: TargetHealthChecksStore;
  target: string;
  targetTitle?: string;
  standalone?: boolean;
}

export interface TargetHealthChecksCardProps {
  targetHealthCheck: TargetHealthCheck;
}
