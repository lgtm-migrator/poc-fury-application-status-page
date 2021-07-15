/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import { UptimeBar } from "./Component";

interface UptimeBarContainerProps {
  itemList: any[]
  viewBoxWidth: number
}

export const UptimeBarContainer = (props: UptimeBarContainerProps) => {
  const itemList = new Array(100).fill({
    status: "Complete"
  });

  return (
    <UptimeBar viewBoxWidth={props.viewBoxWidth} itemList={props.itemList} itemOffset={1} itemWidth={0.5}/>
  )
}