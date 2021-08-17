/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect, useState} from "react";
import {
  EuiIcon,
  EuiPage,
  EuiText,
  EuiPanel,
  EuiTitle,
  EuiPageBody,
  EuiFlexItem,
  EuiFlexGroup,
  EuiPageContent,
  EuiEmptyPrompt,
  EuiLoadingSpinner,
} from "fury-design-system";
import "./Style.scss";
import {LocalizedText} from "./LocalizedText";
import moment, {Moment} from 'moment';
import {HealthCheckStatus, TargetHealthCheck} from "../types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import { ResponsiveHeader } from '../ResponsiveHeader';
import {TargetHealthChecksCardProps, TargetHealthChecksComponentProps} from "./types";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {observer} from "mobx-react";

export default observer(TargetHealthChecksComponent);

function TargetHealthChecksComponent(props: TargetHealthChecksComponentProps) {
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
        isLoading
        ? <EuiEmptyPrompt
            title={<h4> {LocalizedText.singleton.loading} </h4>}
            body={<EuiLoadingSpinner size="xl" />}
          />
        : <EuiPage
            paddingSize="none"
            restrictWidth={true}
            className="healthchecks-list"
          >
            <EuiPageBody>
              <ResponsiveHeader
                context={appContextData}
                pageName={targetUIText}
                standalone={props.standalone}
              />
              <EuiPageContent
                verticalPosition="center"
                horizontalPosition="center"
                paddingSize="l"
                color="transparent"
                hasShadow={false}
              >
                {TargetHealthChecksHeader(props.targetHealthChecksStore.targetHealthChecksList, groupUIText, targetUIText)}
                {getTargetHealthCheckList(props.targetHealthChecksStore.targetHealthChecksList)}
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
      }
    </>
  );
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
    <EuiFlexGroup
      gutterSize="m"
      justifyContent="center"
      direction="column"
      responsive={false}
    >
      <EuiFlexItem>
        <EuiIcon size="xxl" type={messageIcon} color={messageIconColor} />
      </EuiFlexItem>
      <EuiFlexItem className="target-health-checks-message">
        <EuiTitle size="s">
          <h1>
            {message}
          </h1>
        </EuiTitle>
        <EuiTitle size="s" className="title-light">
          <h1>
            {messageTargetHealthCheckList}
          </h1>
        </EuiTitle>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

function getTargetHealthCheckList(targetHealthCheckList: TargetHealthCheck[]) {
  if ((targetHealthCheckList?.length ?? 0) > 0) {
    return targetHealthCheckList.map((targetHealthCheck, index) => {
      return (
        <React.Fragment key={`${targetHealthCheck.checkName}-${index}`}>
          <TargetHealthChecksCard targetHealthCheck={targetHealthCheck} />
        </React.Fragment>
      );
    });
  }
  return <div>No health check found</div>;
}

function TargetHealthChecksCard(props: TargetHealthChecksCardProps) {
  return (
    <EuiPanel
      paddingSize="s"
      className="target-health-check-card"
      color="transparent"
      borderRadius="none"
    >
      <EuiFlexGroup
        gutterSize="none"
        direction="column"
        responsive={false}
      >
        <EuiFlexGroup
          className="check-title"
          gutterSize="m"
          alignItems="center"
          responsive={false}
        >
          <EuiFlexItem grow={false}>
            {TargetHealthChecksCardStatusIcon(props.targetHealthCheck.status)}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiText size="m">
              <p>
                <strong>{props.targetHealthCheck.checkName}</strong>
              </p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup
          gutterSize="none"
          responsive={false}
          justifyContent="spaceBetween"
        >
          <EuiFlexGroup
            gutterSize="none"
            direction="column"
            responsive={false}
            justifyContent="flexStart"
            className="font-color-dark-shade font-weight-semi-bold"
          >
            <EuiFlexItem grow={false}>
              <EuiText className="font-weight-semi-bold" size="s">
                <p>
                  {LocalizedText.singleton.lastCheck}
                </p>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText className="font-weight-semi-bold" size="s">
                <p>
                  {getHealthCheckTimeDiffString(props.targetHealthCheck.lastCheck)}
                </p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          {getLastIssue(props.targetHealthCheck)}
        </EuiFlexGroup>
      </EuiFlexGroup>
    </EuiPanel>
  )
}

function getLastIssue(targetHealthCheck: TargetHealthCheck) {
  // TODO: refactor usign ElasticUI v36.1.0 custom color feature
  // in this way color={JSLOGIC ? 'default' : '#98A2B3'}
  const getClassName = targetHealthCheck.status === "Failed" ? "font-color-darkest-shade" : "font-color-medium-shade";
  const getText = targetHealthCheck.status === "Failed" ? LocalizedText.singleton.issue : LocalizedText.singleton.lastIssue;

  return (
    <EuiFlexGroup
      gutterSize="none"
      direction="column"
      justifyContent="flexStart"
      responsive={false}
    >
      <EuiFlexItem grow={false}>
        <EuiText
          size="s"
          textAlign="right"
          className={`font-weight-semi-bold ${getClassName}`}
          // color={targetHealthCheck.status === "Failed" ? "default" : "#98A2B3"}
        >
          <p>
            {getText}
          </p>
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText
          size="s"
          textAlign="right"
          className={`font-weight-semi-bold ${getClassName}`}
          // color={targetHealthCheck.status === "Failed" ? "default" : "subdued"}
        >
          <p>
            {getLastIssueDateString(targetHealthCheck.status, targetHealthCheck.lastIssue)}
          </p>
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

function TargetHealthChecksCardStatusIcon(status: HealthCheckStatus) {
  if (status === "Complete") {
    return (
      <EuiIcon size="xxl" type="checkInCircleFilled" color="success" />
    )
  }

  return (
    <EuiIcon size="xxl" type="crossInACircleFilled" color="danger" />
  )
}

function getLastIssueDateString(status: HealthCheckStatus, lastIssue?: Moment) {
  if (!lastIssue) {
    return LocalizedText.singleton.neverAnIssue;
  }

  if (status === "Failed") {
    return LocalizedText.singleton.occurringIssue;
  }

  return getHealthCheckTimeDiffString(lastIssue);
}

function getHealthCheckTimeDiffString(healthCheckTime: Moment) {
 return healthCheckTime.from(moment().utc());
}
