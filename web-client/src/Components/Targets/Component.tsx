/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext} from "react";
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
import {HealthCheckStatus, Target} from "../types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import {TargetCardProps, TargetsComponentProps} from "./types";

export default function TargetStatusComponent(props: TargetsComponentProps) {
  const appContextData = useContext(ApplicationContext);
  const groupUIText = appContextData.groupTitle ? appContextData.groupTitle : appContextData.groupLabel;

  const breadcrumbs = [
    {
      text: `All ${groupUIText} systems`,
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
              {TargetStatusHeader(props.targetList, groupUIText)}
              {props.targetList.length > 0 ?
                props.targetList.map((target, index) =>
                  (
                    <React.Fragment key={`${target.target}-${index}`}>
                      <TargetCard target={target} basePath={appContextData.basePath} />
                    </React.Fragment>
                  )
                )
                : (
                  <div>No target found</div>
                )}
            </EuiPageContent>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  )
}

function TargetStatusHeader(targetList: Target[], groupLabel: string) {
  const targetInError = (targetList ?? []).filter((target) => {
    return target.status === ("Failed");
  })
  let messageIcon = 'checkInCircleFilled';
  let messageIconColor = 'success';
  let message = LocalizedText.singleton.healthyStatusMessage(groupLabel);

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

function TargetCardStatusIcon(status: HealthCheckStatus) {
 if (status === "Complete") {
   return (
     <EuiIcon size={"l"} type="checkInCircleFilled" color={"success"} />
   )
 }

 return (
   <EuiIcon size={"l"} type="crossInACircleFilled" color={"danger"} />
 )
}

function TargetCard(props: TargetCardProps) {
 return (
   <EuiPanel paddingSize="s" className="target-card" >
     <EuiFlexGroup gutterSize="m" alignItems={"center"} responsive={false}>
       <EuiFlexItem grow={false}>
         {TargetCardStatusIcon(props.target.status)}
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
           {LocalizedText.singleton.goToTargetHealthChecksButtonMessage} <EuiIcon type={"sortRight"} />
         </EuiCustomLink>
       </EuiFlexItem>
     </EuiFlexGroup>
   </EuiPanel>
 )
}
