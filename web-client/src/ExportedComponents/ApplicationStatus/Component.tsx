/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useContext, useEffect } from "react";
import "fury-design-system/dist/eui_theme_fury_community.css";
import LocalizedText from "./LocalizedText";
import { initialize } from "../../i18n";
import ApplicationContext from "./Context";
import ApplicationStatusRouterFactory from "../../Routes/Base";

export default function ApplicationStatusComponent() {
  const appContextData = useContext(ApplicationContext);

  useEffect(() => {
    initialize.then(() => {
      LocalizedText.singleton.changeLanguage(appContextData.language);
    });
  }, []);

  return <ApplicationStatusRouterFactory />;
}
