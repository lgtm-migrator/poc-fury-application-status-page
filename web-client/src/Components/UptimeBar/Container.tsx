import React from "react";
import { UptimeBar } from "./Component";

export const UptimeBarContainer = () => {
  const itemList = new Array(100).fill({
    status: "Complete"
  });

  return (
    <UptimeBar viewBoxWidth={100} itemList={itemList} itemOffset={1} itemWidth={0.5}/>
  )
}