import React from "react";
import {
  EuiFlexGroup,
  EuiPanel,
  EuiPage,
  EuiPageBody, EuiPageHeader, EuiPageContent, EuiPageHeaderSection, EuiFlexItem, EuiText, EuiIcon, EuiTitle
} from "fury-design-system";
import "./Style.css";
import {EuiCustomLink} from "../EuiCustomLink";

interface ClusterServiceStatusComponentProps {
  language: string;
  releaseNumber: string;
  clusterServiceList: any[];
}

interface ClusterServiceCardProps {
  clusterService: any;
}

const getClusterServiceCardStatusIcon = (status: string) => {
  if (status === 'healthy') {
    return (
      <EuiIcon size={"xxl"} type="checkInCircleFilled" color={"success"} />
    )
  }

  return (
    <EuiIcon size={"xxl"} type="crossInACircleFilled" color={"danger"} />
  )
}

const ClusterServiceCard = (props: ClusterServiceCardProps) => {
  return (
    <EuiPanel paddingSize="s" className="cluster-service-card" color={"transparent"} borderRadius={"none"}>
      <EuiFlexGroup gutterSize="m" alignItems={"center"} responsive={false}>
        <EuiFlexItem grow={false}>
          {getClusterServiceCardStatusIcon(props.clusterService.status)}
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

const getClusterServiceStatusHeader = (clusterServiceList: any[]) => {
  const clusterServiceInError = (clusterServiceList ?? []).filter((clusterService) => {
    return clusterService.status === "error";
  })
  let messageIcon = 'check';
  let messageIconColor = 'success';
  let message = 'The CompanyName Cluster Custom Name 1 system is fully operational';
  let messageClusterServiceList = '';

  if (clusterServiceInError.length > 0) {
    messageIcon = 'cross';
    messageIconColor = 'danger';
    message = `There's an issue related to:`;
    messageClusterServiceList = `${clusterServiceInError.map(clusterService => clusterService.name).join('\r\n')}`;
  }

  return (
    <EuiFlexGroup gutterSize="m" justifyContent={"center"} direction={"column"} responsive={false}>
      <EuiFlexItem>
        <EuiIcon size={"xxl"} type={messageIcon} color={messageIconColor} />
      </EuiFlexItem>
      <EuiFlexItem className={"cluster-service-status-message"}>
        <EuiTitle size={"s"} >
          <h1>
            {message}
          </h1>
        </EuiTitle>
        <EuiText>
          <p>
            {messageClusterServiceList}
          </p>
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
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
              {getClusterServiceStatusHeader(props.clusterServiceList)}
              {props.clusterServiceList.length > 0 ?
                props.clusterServiceList.map((clusterService) =>
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
