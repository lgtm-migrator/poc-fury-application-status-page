/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useContext, useState } from "react";
import { releaseNumber } from "../../constants";
import TargetHealthChecksComponent from "./Component";
import ApplicationContext from "../ApplicationStatus/Context";
import withErrorWrapper from "../ErrorWrapper";
import { TargetHealthChecksContainerProps } from "./types";
import TargetHealthChecksStore from "../../Stores/TargetHealthChecks";

function TargetHealthChecksContainer(props: TargetHealthChecksContainerProps) {
  const appContextData = useContext(ApplicationContext);
  const { target, targetTitle, standalone } = props;
  const [targetHealthChecksStore] = useState<TargetHealthChecksStore>(
    new TargetHealthChecksStore(
      appContextData.apiUrl,
      appContextData.groupLabel,
      target
    )
  );

  return (
    <>
      {targetHealthChecksStore && (
        <TargetHealthChecksComponent
          releaseNumber={releaseNumber}
          targetHealthChecksStore={targetHealthChecksStore}
          target={target}
          targetTitle={targetTitle}
          standalone={standalone}
        />
      )}
    </>
  );
}

export default withErrorWrapper(TargetHealthChecksContainer);
