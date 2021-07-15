/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import {HealthCheckStatus} from "../types";

interface RectangleUnitProps {
  status: HealthCheckStatus;
  x: number;
  width: number;
}

interface UptimeBarProps {
  itemList: any[];
  viewBoxWidth: number;
  itemOffset: number;
  itemWidth: number;
}

const isSuccess = (status: HealthCheckStatus) => {
  const successColor = '#00a39a'; // prenderli da fury theme
  const dangerColor = '#BD271E'; // prenderli da fury theme

  if (status === "Complete") {
    return successColor;
  }

  return dangerColor;
}

const RectangleUnit = (props: RectangleUnitProps) => {
  return (
    <rect height="3" width={props.width} x={props.x} y="0" fill={isSuccess(props.status)} className="" data-html="true"/>
  )
}

export const UptimeBar = (props: UptimeBarProps) => {
  return (
    <>
      <svg viewBox={`0 0 ${props.viewBoxWidth} 3`} xmlns="http://www.w3.org/2000/svg">
        {
          props.itemList.map((item, index) => {
            return (
              <RectangleUnit status={item.status} width={props.itemWidth} x={props.viewBoxWidth - index*props.itemOffset - props.itemWidth} />
            )
          })
        }
      </svg>
    </>
  )
}
