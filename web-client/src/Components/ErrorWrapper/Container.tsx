import React from 'react';
import {EuiErrorBoundary} from "fury-design-system";

export default function ErrorWrapperContainer<T>(ComponentToWrap: React.FunctionComponent<React.PropsWithChildren<T>>) {
  return function WrappedComponent(props: T) {
    return (
      <EuiErrorBoundary>
        <ComponentToWrap {...props}/>
      </EuiErrorBoundary>
    )
  }
}