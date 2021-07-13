/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import {
  EuiFlexGroup,
  EuiPanel,
  EuiPage,
  EuiPageBody, EuiPageHeader, EuiPageContent, EuiPageHeaderSection, EuiFlexItem, EuiText, EuiIcon, EuiTitle
} from "fury-design-system";
import "./Style.css";
import {EuiCustomLink} from "../EuiCustomLink";
import {LocalizedText} from "./LocalizedText";
import moment from 'moment';
import {HealthCheck, HealthCheckStatus, TargetHealthCheck} from "../types";

interface TargetHealthChecksComponentProps {
  language: string;
  releaseNumber: string;
  targetHealthChecksList: TargetHealthCheck[];
  basePath: string;
}

interface TargetHealthChecksCardProps {
  targetHealthCheck: TargetHealthCheck;
}

const getTargetHealthChecksCardStatusIcon = (status: HealthCheckStatus) => {
  if (status === "Complete") {
    return (
      <EuiIcon size={"xxl"} type="checkInCircleFilled" color={"success"} />
    )
  }

  return (
    <EuiIcon size={"xxl"} type="crossInACircleFilled" color={"danger"} />
  )
}

const TargetHealthChecksCard = (props: TargetHealthChecksCardProps) => {
  return (
    <EuiPanel paddingSize="s" className="target-health-check-card" color={"transparent"} borderRadius={"none"}>
      <EuiFlexGroup gutterSize="m" alignItems={"center"} responsive={false}>
        <EuiFlexItem grow={false}>
          {getTargetHealthChecksCardStatusIcon(props.targetHealthCheck.status)}
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

const getTargetHealthChecksHeader = (targetHealthCheckList: TargetHealthCheck[]) => {
  const targetHealthCheckInError = (targetHealthCheckList ?? []).filter((targetHealthCheck) => {
    return targetHealthCheck.status === "Failed";
  })
  let messageIcon = 'check';
  let messageIconColor = 'success';
  let message = LocalizedText.singleton.healthyStatusMessage;
  let messageTargetHealthCheckList = '';

  if (targetHealthCheckInError.length > 0) {
    messageIcon = 'cross';
    messageIconColor = 'danger';
    message = LocalizedText.singleton.errorStatusMessage;
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

const TargetHealthChecksComponent = (props: TargetHealthChecksComponentProps) => {
  return (
    <>
      <EuiPage paddingSize="none" restrictWidth={true}>
        <EuiPageBody>
          <EuiPageHeader
            restrictWidth
            paddingSize="l"
          >
            <EuiPageHeaderSection>
              <EuiCustomLink to={`${props.basePath}/`}>
                <EuiIcon type={"sortLeft"} /> {LocalizedText.singleton.goBack}
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
              {getTargetHealthChecksHeader(props.targetHealthChecksList)}
              {props.targetHealthChecksList.length > 0 ?
                props.targetHealthChecksList.map((targetHealthCheck, index) =>
                  <TargetHealthChecksCard targetHealthCheck={targetHealthCheck} key={`${targetHealthCheck.checkName}-${index}`}/>
                )
                : (
                  <div>No health check found</div>
                )}
            </EuiPageContent>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
};

export default TargetHealthChecksComponent;
