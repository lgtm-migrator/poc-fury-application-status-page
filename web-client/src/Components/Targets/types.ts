/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {Target} from "../types";
import {TargetsStore} from "../../Stores/Targets";

export interface TargetsComponentProps {
  targetsStore: TargetsStore;
}

export interface TargetCardProps {
  target: Target;
  basePath: string;
}
