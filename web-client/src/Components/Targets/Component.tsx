/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useContext, useEffect, useState } from "react";
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
  EuiPageContent,
  EuiEmptyPrompt,
  EuiLoadingSpinner,
} from "fury-design-system";
import "./Style.scss";
import { observer } from "mobx-react";
import { EuiCustomLink } from "../EuiCustomLink";
import { LocalizedText } from "./LocalizedText";
import { HealthCheckStatus, Target } from "../types";
import ApplicationContext from "../ApplicationStatus/Context";
import { TargetCardProps, TargetsComponentProps } from "./types";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import ResponsiveHeader from "../ResponsiveHeader";

function TargetCardStatusIcon(status: HealthCheckStatus) {
  if (status === "Complete") {
    return (
      <EuiIcon
        className="target-status-icon"
        type="checkInCircleFilled"
        color="success"
      />
    );
  }

  return (
    <EuiIcon
      className="target-status-icon"
      type="crossInACircleFilled"
      color="danger"
    />
  );
}

function TargetStatusHeader(targetList: Target[], groupLabel: string) {
  const targetInError = (targetList ?? []).filter((target) => {
    return target.status === "Failed";
  });
  let messageIcon = "checkInCircleFilled";
  let messageIconColor = "success";
  let message = LocalizedText.singleton.healthyStatusMessage(groupLabel);

  if (targetInError.length > 0) {
    messageIcon = "crossInACircleFilled";
    messageIconColor = "danger";
    message = `${LocalizedText.singleton.errorStatusMessage} ${targetInError
      .map((target) => target.target)
      .join(", ")}`;
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
          <h1>{message}</h1>
        </EuiTitle>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}

function TargetCardStatusText(target: Target) {
  if (target.failedChecks === 0) {
    return LocalizedText.singleton.passedHealthChecks(target.totalChecks);
  }

  return LocalizedText.singleton.failedHealthChecks(
    target.failedChecks,
    target.totalChecks
  );
}

function TargetCard(props: TargetCardProps) {
  const { target, basePath } = props;

  return (
    <EuiPanel paddingSize="s" className="target-card">
      <EuiFlexGroup gutterSize="none" alignItems="center" responsive={false}>
        <EuiFlexGroup
          gutterSize="none"
          justifyContent="flexStart"
          direction="column"
          responsive={false}
        >
          <EuiFlexGroup gutterSize="s" wrap={false} responsive={false}>
            <EuiFlexItem grow={false}>
              {TargetCardStatusIcon(target.status)}
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText size="m">
                <p>
                  <strong>{target.target}</strong>
                </p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiText size="xs">
                <p>{LocalizedText.singleton.healthChecks}</p>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem className="target-card__status-text" grow={false}>
              <EuiText size="xs">
                <p>{TargetCardStatusText(target)}</p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexGroup>
        <EuiFlexItem className="target-card__link" grow={false}>
          <EuiCustomLink to={`${basePath}/${target.target}`}>
            {LocalizedText.singleton.goToTargetHealthChecksButtonMessage}{" "}
            <EuiIcon type="sortRight" />
          </EuiCustomLink>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
}

function TargetStatusComponent(props: TargetsComponentProps) {
  const appContextData = useContext(ApplicationContext);
  const groupUIText = appContextData.groupTitle
    ? appContextData.groupTitle
    : appContextData.groupLabel;
  const { targetsStore } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useErrorHandler(error);

  useEffect(() => {
    targetsStore
      .targetListGetAll()
      .then((_) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <EuiEmptyPrompt
          title={<h4> {LocalizedText.singleton.loading} </h4>}
          body={<EuiLoadingSpinner size="xl" />}
        />
      ) : (
        <EuiPage paddingSize="none" restrictWidth className="target-list">
          <EuiPageBody>
            <ResponsiveHeader context={appContextData} />
            <EuiPageContent
              horizontalPosition="center"
              paddingSize="l"
              color="transparent"
              hasShadow={false}
              grow
            >
              <EuiFlexGroup direction="row" responsive={false}>
                <EuiFlexItem>
                  <EuiText color="subdued" size="s">
                    {LocalizedText.singleton.title(groupUIText)}
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiText textAlign="right" size="s">
                    <EuiCustomLink to="/errors-report">
                      {LocalizedText.singleton.errorsReport}{" "}
                      <EuiIcon type="sortRight" />
                    </EuiCustomLink>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>

              <EuiSpacer size="xxl" />
              {TargetStatusHeader(targetsStore.targetList, groupUIText)}
              {targetsStore.targetList.length > 0 ? (
                targetsStore.targetList.map((target) => (
                  <React.Fragment key={`${target.target}-${target.status}`}>
                    <TargetCard
                      target={target}
                      basePath={appContextData.basePath}
                    />
                  </React.Fragment>
                ))
              ) : (
                <div>No target found</div>
              )}
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      )}
    </>
  );
}

export default observer(TargetStatusComponent);
