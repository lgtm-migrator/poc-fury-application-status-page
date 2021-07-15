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
import {LocalizedText} from './LocalizedText';
import { UptimeBar } from "../UptimeBar";
import {HealthCheckStatus, Target} from "../types";
import {logger} from "../../Services/Logger";

interface TargetsComponentProps {
  language: string;
  releaseNumber: string;
  targetList: Target[];
  basePath: string;
  groupLabel: string;
}

interface TargetCardProps {
  target: Target;
  basePath: string;
}

const getTargetCardStatusIcon = (status: HealthCheckStatus) => {
 if (status === "Complete") {
   return (
     <EuiIcon size={"l"} type="checkInCircleFilled" color={"success"} />
   )
 }

 return (
   <EuiIcon size={"l"} type="crossInACircleFilled" color={"danger"} />
 )
}

const TargetCard = (props: TargetCardProps) => {
 return (
   <EuiPanel paddingSize="s" className="cluster-card" >
     <EuiFlexGroup gutterSize="m" alignItems={"center"} responsive={false}>
       <EuiFlexItem grow={false}>
         {getTargetCardStatusIcon(props.target.status)}
       </EuiFlexItem>
       <EuiFlexItem grow={false}>
         <EuiText size="s" >
           <p>
             <strong>{props.target.target}</strong>
           </p>
         </EuiText>
       </EuiFlexItem>
       <EuiFlexItem style={{marginLeft: "auto"}} grow={false}>
         <EuiCustomLink to={`${props.basePath}/${props.target.target}`}>
           {LocalizedText.singleton.goToClusterServicesButtonMessage} <EuiIcon type={"sortRight"} />
         </EuiCustomLink>
       </EuiFlexItem>
     </EuiFlexGroup>
   </EuiPanel>
 )
}

const getTargetStatusHeader = (targetList: Target[], groupLabel: string) => {
  const targetInError = (targetList ?? []).filter((target) => {
    return target.status === ("Failed");
  })
  let messageIcon = 'checkInCircleFilled';
  let messageIconColor = 'success';
  let message = LocalizedText.singleton.healthyStatusMessage(groupLabel);
  logger.info(`groupLabel: ${groupLabel}`)

  if (targetInError.length > 0) {
    messageIcon = 'crossInACircleFilled';
    messageIconColor = 'danger';
    message = `${LocalizedText.singleton.errorStatusMessage} ${targetInError.map(target => target.target).join(', ')}`;
  }

  return (
    <EuiFlexGroup gutterSize="m" alignItems={"center"} justifyContent={"center"} direction={"column"} responsive={false}>
      <EuiFlexItem>
        <EuiIcon size={"xxl"} type={messageIcon} color={messageIconColor} />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiTitle size={"s"} className={"target-status-text"}>
          <h1>
            {message}
          </h1>
        </EuiTitle>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

const TargetStatusComponent = (props: TargetsComponentProps) => {
  const breadcrumbs = [
    {
      text: `All ${props.groupLabel} systems`,
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
              {getTargetStatusHeader(props.targetList, props.groupLabel)}
              {props.targetList.length > 0 ?
                props.targetList.map((target, index) =>
                (
                  <>
                    <TargetCard target={target} basePath={props.basePath} key={`${target.target}-${index}`}/>
                    <UptimeBar viewBoxWidth={100} itemList={props.targetList} key={index} />
                  </>
                )
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

export default TargetStatusComponent;
