/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useEffect, useState } from "react";
import { releaseNumber } from "../../constants";
import TargetStatusComponent from "./Component";
import { EuiEmptyPrompt, EuiLoadingSpinner } from "fury-design-system";
import {logger} from "../../Services/Logger";
import {HealthCheck, HealthCheckResponse, HealthCheckStatus, Target} from "../types";

interface TargetsContainerProps {
  apiUrl: string;
  language: string;
  releaseNumber: string;
  basePath: string;
  groupLabel: string;
}

const fetchTargetListAsync = async (apiUrl: string, groupLabel: string) => {
  const targetList = await fetch(`${apiUrl}group/${groupLabel}`);

  return await targetList.json() as HealthCheckResponse;
};

const groupByTarget = (targetList: HealthCheck[]): Target[] => {
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

const TargetsContainer = (props: TargetsContainerProps) => {
  const [targetList, setTargetList] = useState<Target[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTargetListAsync(props.apiUrl, props.groupLabel)
      .then((targetListJson) => {

        setTargetList(groupByTarget(targetListJson.results));
        setIsLoading(false);
      })
      .catch((err) => {
        logger.error(err);

        throw new Error("failed to get target list");
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
        <TargetStatusComponent
          language={props.language}
          releaseNumber={releaseNumber}
          targetList={targetList}
          basePath={props.basePath}
        />
      )}
    </>
  );
};

export default TargetsContainer;
