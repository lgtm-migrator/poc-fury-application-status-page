/*
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect, useState} from "react";
import TargetStatusComponent from "./Component";
import { EuiEmptyPrompt, EuiLoadingSpinner } from "fury-design-system";
import {logger} from "../../Services/Logger";
import {HealthCheck, HealthCheckResponse, Target} from "../types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import {ErrorWrapper} from "../ErrorWrapper";
import useErrorHandler from "../../Hooks/UseErrorHandler";

export default ErrorWrapper(TargetsContainer);

function TargetsContainer() {
  const [targetList, setTargetList] = useState<Target[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const appContextData = useContext(ApplicationContext);

  useErrorHandler(errorMessage);

  useEffect(() => {
    fetchTargetListAsync(appContextData.apiUrl, appContextData.groupLabel)
      .then((targetListJson) => {
        if(!targetListJson) throw new Error("targetList is undefined");

        setTargetList(groupByTarget(targetListJson));
        setIsLoading(false);
      })
      .catch((err) => {
        logger.error(err);
        setErrorMessage(err);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <EuiEmptyPrompt
          title={<h4> Loading... </h4>}
          body={<EuiLoadingSpinner size="xl" />}
        />
      ) : (
        <TargetStatusComponent targetList={targetList} />
      )}
    </>
  );
}

async function fetchTargetListAsync(apiUrl: string, groupLabel: string): Promise<HealthCheckResponse> {
  const targetList = await fetch(`${apiUrl}group/${groupLabel}`);

  return await targetList.json();
}

function groupByTarget(targetList: HealthCheck[]): Target[] {
  const getTargetIndexInAccumulator = (target: HealthCheck, accumulator: Target[]): number => {
    return accumulator.findIndex((checkTarget) => checkTarget.target === target.target);
  }

  return targetList.reduce((targetAcc, currentTarget) => {
    const targetIndex = getTargetIndexInAccumulator(currentTarget, targetAcc);

    if (targetIndex !== -1 && currentTarget.status === "Failed") {
      targetAcc[targetIndex].status = "Failed";
    }

    if (targetIndex === -1) {
      targetAcc.push({
        status: currentTarget.status,
        target: currentTarget.target
      });
    }

    return targetAcc;
  }, [] as Target[]);
}
