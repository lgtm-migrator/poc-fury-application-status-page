import React from "react";
import {EuiFlexGroup, EuiPanel} from "fury-design-system";

interface ClusterStatusComponentProps {
  language: string;
  releaseNumber: string;
  clusterList: any[];
}

const ClusterStatusComponent = (props: ClusterStatusComponentProps) => {
  return (
    <>
      {props.clusterList.length > 0 ? (
        <EuiPanel paddingSize="s" className="service-card">
          <EuiFlexGroup gutterSize="l">
            <div>Cluster Stuff</div>
          </EuiFlexGroup>
        </EuiPanel>
      ) : (
        <div>No cluster found</div>
      )}
    </>
  );
};

export default ClusterStatusComponent;
