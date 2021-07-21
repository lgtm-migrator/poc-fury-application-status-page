/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect, useState} from "react";
import {
  EuiFlexGroup,
  EuiPanel,
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiPageContent,
  EuiPageHeaderSection,
  EuiFlexItem,
  EuiText,
  EuiIcon,
  EuiTitle,
  EuiEmptyPrompt, EuiLoadingSpinner
} from "fury-design-system";
import "./Style.css";
import {EuiCustomLink} from "../EuiCustomLink";
import {LocalizedText} from "./LocalizedText";
import moment from 'moment';
import {HealthCheckStatus, TargetHealthCheck} from "../types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import {TargetHealthChecksCardProps, TargetHealthChecksComponentProps} from "./types";
import useErrorHandler from "../../Hooks/UseErrorHandler";

export default function TargetHealthChecksComponent(props: TargetHealthChecksComponentProps) {
  const appContextData = useContext(ApplicationContext);
  const groupUIText = appContextData.groupTitle ? appContextData.groupTitle : appContextData.groupLabel;
  const targetUIText = props.targetTitle ? props.targetTitle : props.target;
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useErrorHandler(error);

  useEffect(() => {
   props.targetHealthChecksStore.targetHealthChecksListGetAll()
     .then(() => {
        setIsLoading(false);
     })
     .catch(err => {
        setError(err);
     })
  }, [])

  return (
    <>
      {
        isLoading ?
        (
          <EuiEmptyPrompt
            title={<h4> Loading... </h4>}
            body={<EuiLoadingSpinner size="xl" />}
          />
        ) :
          <EuiPage paddingSize="none" restrictWidth={true}>
            <EuiPageBody>
              <EuiPageHeader
                restrictWidth
                paddingSize="l"
              >
                {!props.standalone &&
                <EuiPageHeaderSection>
                    <EuiCustomLink to={`${appContextData.basePath}/`}>
                        <EuiIcon type={"sortLeft"}/> {LocalizedText.singleton.goBack}
                    </EuiCustomLink>
                </EuiPageHeaderSection>
                }
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
                  {TargetHealthChecksHeader(props.targetHealthChecksStore.targetHealthChecksList, groupUIText, targetUIText)}
                  {props.targetHealthChecksStore.targetHealthChecksList.length > 0 ?
                    props.targetHealthChecksStore.targetHealthChecksList.map((targetHealthCheck, index) =>
                      (
                        <React.Fragment key={`${targetHealthCheck.checkName}-${index}`}>
                          <TargetHealthChecksCard targetHealthCheck={targetHealthCheck} />
                        </React.Fragment>
                      )
                    )
                    : (
                      <div>No health check found</div>
                    )}
                </EuiPageContent>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
      }
    </>
  );
}

function TargetHealthChecksCardStatusIcon(status: HealthCheckStatus) {
  if (status === "Complete") {
    return (
      <EuiIcon size={"xxl"} type="checkInCircleFilled" color={"success"} />
    )
  }

  return (
    <EuiIcon size={"xxl"} type="crossInACircleFilled" color={"danger"} />
  )
}

function TargetHealthChecksCard(props: TargetHealthChecksCardProps) {
  return (
    <EuiPanel paddingSize="s" className="target-health-check-card" color={"transparent"} borderRadius={"none"}>
      <EuiFlexGroup gutterSize="m" alignItems={"center"} responsive={false}>
        <EuiFlexItem grow={false}>
          {TargetHealthChecksCardStatusIcon(props.targetHealthCheck.status)}
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText size="s" >
            <p>
              <strong>{props.targetHealthCheck.checkName}</strong>
            </p>
          </EuiText>
          {
            props.targetHealthCheck.status === ("Failed") &&
            <EuiText size={"s"} >
                <p>
                  {LocalizedText.singleton.errorOccurredAt} {moment(props.targetHealthCheck.completedAt).format("DD/MM/YYYY HH:mm Z")}
                </p>
            </EuiText>
          }
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  )
}

function TargetHealthChecksHeader(targetHealthCheckList: TargetHealthCheck[], groupLabel: string, target: string) {
  const targetHealthCheckInError = (targetHealthCheckList ?? []).filter((targetHealthCheck) => {
    return targetHealthCheck.status === "Failed";
  })
  let messageIcon = 'check';
  let messageIconColor = 'success';
  let message = LocalizedText.singleton.healthyStatusMessage(groupLabel, target);
  let messageTargetHealthCheckList = '';

  if (targetHealthCheckInError.length > 0) {
    messageIcon = 'cross';
    messageIconColor = 'danger';
    message = LocalizedText.singleton.errorStatusMessage(targetHealthCheckInError.length, groupLabel, target);
    messageTargetHealthCheckList = `${targetHealthCheckInError.map(targetHealthCheck => targetHealthCheck.checkName).join('\r\n')}`;
  }

  return (
    <EuiFlexGroup gutterSize="m" justifyContent={"center"} direction={"column"} responsive={false}>
      <EuiFlexItem>
        <EuiIcon size={"xxl"} type={messageIcon} color={messageIconColor} />
      </EuiFlexItem>
      <EuiFlexItem className={"target-health-checks-message"}>
        <EuiTitle size={"s"} >
          <h1>
            {message}
          </h1>
        </EuiTitle>
        <EuiText>
          <p>
            {messageTargetHealthCheckList}
          </p>
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}
