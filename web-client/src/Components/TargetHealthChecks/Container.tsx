/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useEffect, useState } from "react";
import { releaseNumber } from "../../constants";
import TargetHealthChecksComponent from "./Component";
import { EuiEmptyPrompt, EuiLoadingSpinner } from "fury-design-system";
import {logger} from "../../Services/Logger";
import {HealthCheck, TargetHealthCheck} from "../types";

interface TargetHealthChecksComponentProps {
  apiUrl: string;
  language: string;
  releaseNumber: string;
  target: string;
  groupLabel: string;
  basePath: string;
}

const fetchTargetHealthChecksListAsync = async (apiUrl: string, groupLabel: string, target: string) => {
  const clusterList = await fetch(`${apiUrl}group/${groupLabel}/target/${target}`);

  return await clusterList.json();
};

const groupByCheckName = (targetList: HealthCheck[]): TargetHealthCheck[] => {
  // TODO: ADD completedAt logic on error more recent
  const getTargetIndexInAccumulator = (target: HealthCheck, accumulator: TargetHealthCheck[]): number => {
    return accumulator.findIndex((checkTarget) => checkTarget.checkName === target.checkName);
  }

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

const TargetHealthChecksContainer = (props: TargetHealthChecksComponentProps) => {
  const [clusterServiceList, setClusterServiceList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  logger.info(JSON.stringify(props))

  useEffect(() => {
    fetchTargetHealthChecksListAsync(props.apiUrl, props.groupLabel, props.target)
      .then((clusterListJson) => {
        setClusterServiceList(groupByCheckName(clusterListJson.results));
        setIsLoading(false);
      })
      .catch((err) => {
        logger.error(err);
        throw new Error("failed to get cluster list");
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
        <TargetHealthChecksComponent
          language={props.language}
          releaseNumber={releaseNumber}
          targetHealthChecksList={clusterServiceList}
          basePath={props.basePath}
        />
      )}
    </>
  );
};

export default TargetHealthChecksContainer;
