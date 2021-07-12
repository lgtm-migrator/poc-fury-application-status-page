/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useEffect, useState } from "react";
import { releaseNumber } from "../../constants";
import ClusterStatusComponent from "./Component";
import { EuiEmptyPrompt, EuiLoadingSpinner } from "fury-design-system";

interface ClusterStatusComponentProps {
  apiUrl: string;
  language: string;
  releaseNumber: string;
  basePath: string;
}

const fetchClusterListAsync = async (apiUrl: string) => {
  const clusterList = await fetch(`${apiUrl}list`);

  return await clusterList.json();
};

const ClusterStatusContainer = (props: ClusterStatusComponentProps) => {
  const [clusterList, setClusterList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClusterListAsync(props.apiUrl)
      .then((clusterListJson) => {
        setClusterList(clusterListJson);
        setIsLoading(false);
      })
      .catch(() => {
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
        <ClusterStatusComponent
          language={props.language}
          releaseNumber={releaseNumber}
          clusterList={clusterList}
          basePath={props.basePath}
        />
      )}
    </>
  );
};

export default ClusterStatusContainer;
