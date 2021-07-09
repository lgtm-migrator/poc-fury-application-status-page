/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useEffect, useState } from "react";
import { releaseNumber } from "../../constants";
import ClusterServiceStatusComponent from "./Component";
import { EuiEmptyPrompt, EuiLoadingSpinner } from "fury-design-system";
import {logger} from "../../Services/Logger";

interface ClusterServiceStatusComponentProps {
  apiUrl: string;
  language: string;
  releaseNumber: string;
  clusterId: string;
  basePath: string;
}

const fetchClusterServiceListAsync = async (apiUrl: string, clusterId: string) => {
  const clusterList = await fetch(`${apiUrl}${clusterId}/list`);

  return await clusterList.json();
};

const ClusterServiceStatusContainer = (props: ClusterServiceStatusComponentProps) => {
  const [clusterServiceList, setClusterServiceList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  logger.info(JSON.stringify(props))

  useEffect(() => {
    fetchClusterServiceListAsync(props.apiUrl, props.clusterId)
      .then((clusterListJson) => {
        setClusterServiceList(clusterListJson);
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
        <ClusterServiceStatusComponent
          language={props.language}
          releaseNumber={releaseNumber}
          clusterServiceList={clusterServiceList}
          basePath={props.basePath}
        />
      )}
    </>
  );
};

export default ClusterServiceStatusContainer;
