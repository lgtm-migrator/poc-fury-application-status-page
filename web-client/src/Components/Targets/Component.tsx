/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect, useState} from "react";
import {
  EuiPage,
  EuiText,
  EuiIcon,
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiPageBody,
  EuiFlexItem,
  EuiFlexGroup,
  EuiPageHeader,
  EuiPageContent,
  EuiEmptyPrompt,
  EuiLoadingSpinner,
} from "fury-design-system";
import "./Style.scss";
import {EuiCustomLink} from "../EuiCustomLink";
import {LocalizedText} from './LocalizedText';
import {HealthCheckStatus, Target} from "../types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import {TargetCardProps, TargetsComponentProps} from "./types";
import {observer} from "mobx-react";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import { ResponsiveHeader } from "../ResponsiveHeader";

export default observer(TargetStatusComponent);

function TargetStatusComponent(props: TargetsComponentProps) {
  const appContextData = useContext(ApplicationContext);
  const groupUIText = appContextData.groupTitle ? appContextData.groupTitle : appContextData.groupLabel;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useErrorHandler(error);

  useEffect(() => {
    props.targetsStore.targetListGetAll()
      .then((targets) => {
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
      })
  }, [])

  return (
    <>
      {
        isLoading
          ? <EuiEmptyPrompt
              title={<h4> Loading... </h4>}
              body={<EuiLoadingSpinner size="xl" />}
            />
          : <EuiPage paddingSize="none" restrictWidth={true} className="target-list">
              <EuiPageBody>
                <EuiPageHeader
                  restrictWidth
                  paddingSize="l"
                />
                <ResponsiveHeader context={appContextData} />
                <EuiPageContent
                  horizontalPosition="center"
                  paddingSize="l"
                  color="transparent"
                  hasShadow={false}
                  grow={true}
                >
                <EuiText color="subdued" size="s">
                  {`${groupUIText} overview`}
                </EuiText>
                <EuiSpacer size="xxl" />
                  {TargetStatusHeader(props.targetsStore.targetList, groupUIText)}
                  {
                    props.targetsStore.targetList.length > 0
                      ? props.targetsStore.targetList.map((target, index) =>
                          <React.Fragment key={`${target.target}-${index}`}>
                            <TargetCard target={target} basePath={appContextData.basePath} />
                          </React.Fragment>
                        )
                      : <div>No target found</div>
                  }
                </EuiPageContent>
              </EuiPageBody>
            </EuiPage>
      }
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
    <EuiFlexGroup
      gutterSize="m"
      responsive={false}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <EuiFlexItem>
        <EuiIcon size="xxl" type={messageIcon} color={messageIconColor} />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiTitle size="s" className="target-status-text">
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
     <EuiIcon className="target-status-icon" type="checkInCircleFilled" color="success" />
   )
 }

 return (
   <EuiIcon className="target-status-icon" type="crossInACircleFilled" color="danger" />
 )
}

function TargetCardStatusText(target: Target) {
  if (target.failedChecks === 0) {
    return `ALL ${target.totalChecks} PASSED`;
  }

  return `${target.failedChecks}/${target.totalChecks} FAILED`;
}

function TargetCard(props: TargetCardProps) {
 return (
   <EuiPanel paddingSize="s" className="target-card" >
     <EuiFlexGroup gutterSize="none" alignItems="center" responsive={false}>
       <EuiFlexGroup gutterSize="none" justifyContent="flexStart" direction="column" responsive={false}>
         <EuiFlexGroup gutterSize="s" wrap={false} responsive={false}>
           <EuiFlexItem grow={false}>
             {TargetCardStatusIcon(props.target.status)}
           </EuiFlexItem>
           <EuiFlexItem grow={false}>
             <EuiText size="m" >
               <p>
                 <strong>{props.target.target}</strong>
               </p>
             </EuiText>
           </EuiFlexItem>
         </EuiFlexGroup>
         <EuiFlexGroup responsive={false}>
           <EuiFlexItem grow={false}>
             <EuiText size="xs">
               <p>
                 HEALTHCHECKS
               </p>
             </EuiText>
           </EuiFlexItem>
           <EuiFlexItem className={"target-card__status-text"} grow={false}>
             <EuiText size="xs">
               <p>
                 {TargetCardStatusText(props.target)}
               </p>
             </EuiText>
           </EuiFlexItem>
         </EuiFlexGroup>
       </EuiFlexGroup>
       <EuiFlexItem className="target-card__link" grow={false}>
         <EuiCustomLink to={`${props.basePath}/${props.target.target}`}>
           {LocalizedText.singleton.goToTargetHealthChecksButtonMessage} <EuiIcon type="sortRight" />
         </EuiCustomLink>
       </EuiFlexItem>
     </EuiFlexGroup>
   </EuiPanel>
 )
}
