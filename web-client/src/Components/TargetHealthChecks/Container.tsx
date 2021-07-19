/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect, useState} from "react";
import { releaseNumber } from "../../constants";
import TargetHealthChecksComponent from "./Component";
import { EuiEmptyPrompt, EuiLoadingSpinner } from "fury-design-system";
import {logger} from "../../Services/Logger";
import {HealthCheck, HealthCheckResponse, TargetHealthCheck} from "../types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import {ErrorWrapper} from "../ErrorWrapper";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {TargetHealthChecksContainerProps} from "./types";

export default ErrorWrapper(TargetHealthChecksContainer);

function TargetHealthChecksContainer(props: TargetHealthChecksContainerProps) {
  const [targetHealthChecksList, setTargetHealthChecksList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const appContextData = useContext(ApplicationContext);

  useErrorHandler(errorMessage);

  useEffect(() => {
    fetchTargetHealthChecksListAsync(appContextData.apiUrl, appContextData.groupLabel, props.target)
      .then((targetHealthChecksListJson) => {
        if(!targetHealthChecksListJson) throw new Error("targetList is undefined");

        setTargetHealthChecksList(groupByCheckName(targetHealthChecksListJson));
        setIsLoading(false);
      })
      .catch(err => {
        logger.error(err);
        setErrorMessage(err);
      })
  }, []);

  return (
    <>
      {isLoading ? (
        <EuiEmptyPrompt
          title={<h4> Loading... </h4>}
          body={<EuiLoadingSpinner size="xl" />}
        />
      ) : (
        <TargetHealthChecksComponent
          releaseNumber={releaseNumber}
          targetHealthChecksList={targetHealthChecksList}
          target={props.target}
          targetTitle={props.targetTitle}
          standalone={props.standalone}
        />
      )}
    </>
  );
}

async function fetchTargetHealthChecksListAsync(apiUrl: string, groupLabel: string, target: string): Promise<HealthCheckResponse> {
  const targetHealthChecks = await fetch(`${apiUrl}group/${groupLabel}/target/${target}`);

  return await targetHealthChecks.json();
}

function groupByCheckName(targetList: HealthCheck[]): TargetHealthCheck[] {
  const getTargetIndexInAccumulator = (target: HealthCheck, accumulator: TargetHealthCheck[]): number => {
    return accumulator.findIndex((checkTarget) => checkTarget.checkName === target.checkName);
  }

  // TODO: ADD completedAt logic on error more recent
  return targetList.reduce((targetAcc, currentTarget) => {
    const targetIndex = getTargetIndexInAccumulator(currentTarget, targetAcc);
    if (targetIndex !== -1 && currentTarget.status === "Failed") {
      targetAcc[targetIndex].status = "Failed";
    }

    if (targetIndex === -1) {
      targetAcc.push({
        status: currentTarget.status,
        checkName: currentTarget.checkName
      });
    }

    return targetAcc;
  }, [] as TargetHealthCheck[]);
}
