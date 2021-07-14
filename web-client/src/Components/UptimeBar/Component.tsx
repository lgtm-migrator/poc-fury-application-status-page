import React from "react";

export const UptimeBar = () => {
  const viewboxWidth = 100;
  const successColor = '#00a39a';
  const dangerColor = '#BD271E';

  const RectangleUnit = () => {
    return (
      <rect height="34" width="1" x="97" y="0" fill={successColor} className="uptime-day component-mvm98gtxvb9b day-0" data-html="true"></rect>
    )
  }

  return (
    <>
      <svg viewBox={`0 0 ${viewboxWidth} 3`} xmlns="http://www.w3.org/2000/svg">
        <RectangleUnit />
        <rect height="100" width="1" x="99" y="0" fill={dangerColor} className="uptime-day component-mvm98gtxvb9b day-0" data-html="true"></rect>
      </svg>
    </>
  )
}