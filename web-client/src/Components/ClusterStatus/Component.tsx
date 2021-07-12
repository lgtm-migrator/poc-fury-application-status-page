/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import {
  EuiFlexGroup,
  EuiPanel,
  EuiHeaderBreadcrumbs,
  EuiPage,
  EuiPageBody, EuiPageHeader, EuiPageContent, EuiPageHeaderSection, EuiFlexItem, EuiText, EuiIcon, EuiTitle
} from "fury-design-system";
import "./Style.css";
import {EuiCustomLink} from "../EuiCustomLink";
import { LocalizedText } from './LocalizedText';

interface ClusterStatusComponentProps {
  language: string;
  releaseNumber: string;
  clusterList: any[];
  basePath: string;
}

interface ClusterCardProps {
  cluster: any;
  basePath: string;
}

const getClusterCardStatusIcon = (status: string) => {
 if (status === 'healthy') {
   return (
     <EuiIcon size={"l"} type="checkInCircleFilled" color={"success"} />
   )
 }

 return (
   <EuiIcon size={"l"} type="crossInACircleFilled" color={"danger"} />
 )
}

const ClusterCard = (props: ClusterCardProps) => {
 return (
   <EuiPanel paddingSize="s" className="cluster-card" >
     <EuiFlexGroup gutterSize="m" alignItems={"center"} responsive={false}>
       <EuiFlexItem grow={false}>
         {getClusterCardStatusIcon(props.cluster.status)}
       </EuiFlexItem>
       <EuiFlexItem grow={false}>
         <EuiText size="s" >
           <p>
             <strong>{props.cluster.name}</strong>
           </p>
         </EuiText>
       </EuiFlexItem>
       <EuiFlexItem style={{marginLeft: "auto"}} grow={false}>
         <EuiCustomLink to={`${props.basePath}/${props.cluster.id}/status`}>
           {LocalizedText.singleton.goToClusterServicesButtonMessage} <EuiIcon type={"sortRight"} />
         </EuiCustomLink>
       </EuiFlexItem>
     </EuiFlexGroup>
   </EuiPanel>
 )
}

const getClusterStatusHeader = (clusterList: any[]) => {
  const clusterInError = (clusterList ?? []).filter((cluster) => {
    return cluster.status === "error";
  })
  let messageIcon = 'checkInCircleFilled';
  let messageIconColor = 'success';
  let message = LocalizedText.singleton.healthyStatusMessage;

  if (clusterInError.length > 0) {
    messageIcon = 'crossInACircleFilled';
    messageIconColor = 'danger';
    message = `${LocalizedText.singleton.errorStatusMessage} ${clusterInError.map(cluster => cluster.name).join(', ')}`;
  }

  return (
    <EuiFlexGroup gutterSize="m" alignItems={"center"} justifyContent={"center"} direction={"column"} responsive={false}>
      <EuiFlexItem>
        <EuiIcon size={"xxl"} type={messageIcon} color={messageIconColor} />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiTitle size={"s"} className={"cluster-status-text"}>
          <h1>
            {message}
          </h1>
        </EuiTitle>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

const ClusterStatusComponent = (props: ClusterStatusComponentProps) => {
  const breadcrumbs = [
    {
      text: 'All company systems',
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
      },
      className: 'no-mouse-event'
    },
    {
      text: '',
      className: 'no-show',
    }
  ]
  return (
    <>
      <EuiPage paddingSize="none" restrictWidth={true}>
        <EuiPageBody>
          <EuiPageHeader
            restrictWidth
            paddingSize="l"
          >
            <EuiPageHeaderSection>
              <EuiHeaderBreadcrumbs
                aria-label="Header breadcrumbs example"
                breadcrumbs={breadcrumbs}
                responsive={false}
                className={"ml-0"}
              />
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent
            borderRadius="none"
            hasShadow={false}
            style={{ display: 'flex' }}
            color="transparent"
          >
            <EuiPageContent
              horizontalPosition="center"
              paddingSize="none"
              color="transparent"
              style={{ maxWidth: "600px", width: "100%" }}
              hasShadow={false}>
              {getClusterStatusHeader(props.clusterList)}
              {props.clusterList.length > 0 ?
                props.clusterList.map((cluster) =>
                  <ClusterCard cluster={cluster} basePath={props.basePath} key={cluster.id}/>
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

export default ClusterStatusComponent;
