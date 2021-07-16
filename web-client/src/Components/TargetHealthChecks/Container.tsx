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
import {HealthCheck, TargetHealthCheck} from "../types";
import {ApplicationContext} from "../ApplicationStatus/Container";

interface TargetHealthChecksComponentProps {
  target: string;
}

export default function TargetHealthChecksContainer(props: TargetHealthChecksComponentProps) {
  const [targetHealthChecksList, setTargetHealthChecksList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const appContextData = useContext(ApplicationContext);

  useEffect(() => {
    fetchTargetHealthChecksListAsync(appContextData.apiUrl, appContextData.groupLabel, props.target)
      .then((targetHealthChecksListJson) => {
        setTargetHealthChecksList(groupByCheckName(targetHealthChecksListJson.results));
        setIsLoading(false);
      })
      .catch((err) => {
        logger.error(err);
        throw new Error("failed to get target health checks list");
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
          releaseNumber={releaseNumber}
          targetHealthChecksList={targetHealthChecksList}
          target={props.target}
        />
      )}
    </>
  );
}

async function fetchTargetHealthChecksListAsync(apiUrl: string, groupLabel: string, target: string) {
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
