/* eslint-disable react/jsx-props-no-spreading */
/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import { EuiErrorBoundary } from "fury-design-system";

export default function ErrorWrapperContainer<T>(
  ComponentToWrap: React.FunctionComponent<React.PropsWithChildren<T>>
) {
  return function WrappedComponent(props: T) {
    return (
      <EuiErrorBoundary>
        <ComponentToWrap {...props} />
      </EuiErrorBoundary>
    );
  };
}
