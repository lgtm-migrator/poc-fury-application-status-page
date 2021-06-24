import React, { useState, useEffect } from "react";
import {EuiErrorBoundary} from "fury-design-system";

const FuryApplicationStatusReact = () => {
  return <div>Fury Application Status Module</div>;
}

const FuryApplicationStatus = () => {
  return (
    <EuiErrorBoundary>
      <FuryApplicationStatusReact />
    </EuiErrorBoundary>
  );
};

export default FuryApplicationStatus;