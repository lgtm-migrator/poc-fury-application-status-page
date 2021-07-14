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
  const successColor = '#00a39a';
  const dangerColor = '#BD271E';

  if (status === "Complete") {
    return successColor;
  }

  return dangerColor;
}

const RectangleUnit = (props: RectangleUnitProps) => {
  return (
    <rect height="34" width={props.width} x={props.x} y="0" fill={isSuccess(props.status)} className="uptime-day day-0" data-html="true"/>
  )
}

export const UptimeBar = (props: UptimeBarProps) => {
  return (
    <>
      <svg viewBox={`0 0 ${props.viewBoxWidth} 3`} xmlns="http://www.w3.org/2000/svg">
        {
          props.itemList.map((item, index) => {
            return (
              <RectangleUnit status={"Complete"} width={props.itemWidth} x={props.viewBoxWidth - index*props.itemOffset - props.itemWidth} />
            )
          })
        }
      </svg>
    </>
  )
}
