/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Factory } from "fury-component";

export const logger = Factory.logger(
  {
    level: process.env.APP_ENV === "production" ? "warn" : "debug",
  },
  {
    // todo append client name
    name: "FURY_APPLICATION_STATUS_SINGLETON",
    // todo add client guid from process.env
  }
);
