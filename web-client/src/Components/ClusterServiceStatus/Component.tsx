import React from "react";
import {
  EuiFlexGroup,
  EuiPanel,
  EuiPage,
  EuiPageBody, EuiPageHeader, EuiPageContent, EuiPageHeaderSection, EuiFlexItem, EuiText, EuiIcon, EuiLink
} from "fury-design-system";
import "./Style.css";
import {EuiCustomLink} from "../EuiCustomLink";

interface ClusterServiceStatusComponentProps {
  language: string;
  releaseNumber: string;
  clusterList: any[];
}

interface ClusterServiceCardProps {
  clusterService: any;
}

const ClusterServiceCard = (props: ClusterServiceCardProps) => {
  return (
    <EuiPanel paddingSize="s" className="cluster-service-card" color={"transparent"} borderRadius={"none"}>
      <EuiFlexGroup gutterSize="m" alignItems={"center"} responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiIcon size={"xxl"} type="checkInCircleFilled" color={"success"} />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText size="s" >
            <p>
              <strong>{props.clusterService.name}</strong>
            </p>
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  )
}

const ClusterServiceStatusComponent = (props: ClusterServiceStatusComponentProps) => {
  return (
    <>
      <EuiPage paddingSize="none" restrictWidth={true}>
        <EuiPageBody>
          <EuiPageHeader
            restrictWidth
            paddingSize="l"
          >
            <EuiPageHeaderSection>
              {/* TODO: Add BasePath */}
              <EuiCustomLink to={`/`}>
                <EuiIcon type={"sortLeft"} /> back
              </EuiCustomLink>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent
            borderRadius="none"
            hasShadow={false}
            style={{ display: 'flex' }}
            color="transparent"
          >
            <EuiPageContent
              verticalPosition="center"
              horizontalPosition="center"
              paddingSize="none"
              color="transparent"
              style={{ maxWidth: "600px", width: "100%" }}
              hasShadow={false}>
              {props.clusterList.length > 0 ?
                props.clusterList.map((clusterService) =>
                  <ClusterServiceCard clusterService={clusterService} key={clusterService.id}/>
                )
                : (
                  <div>No cluster found</div>
                )}
            </EuiPageContent>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
};

export default ClusterServiceStatusComponent;
