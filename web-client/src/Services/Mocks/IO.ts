/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {MockedErrorHealthCheckCountByDay, MockedSchema} from "./types";
import {ErrorHealthCheckCountByDay} from "../../Components/types";
import moment from "moment";

export function getAllHealthChecksByGroup(
  schema: MockedSchema
) {
  return schema
    .all("healthCheck")
    .models
}

export function getAllHealthChecksByGroupAndTarget(
  schema: MockedSchema,
  targetLabel: string
) {
  return schema
    .all("healthCheck")
    .models
    .filter(healthCheck => healthCheck.target === targetLabel);
}

export function getAllFailedHealthCountByDay(
  schema: MockedSchema
) {
  return schema
    .all("healthCheck")
    .models
    .filter(healthCheck => healthCheck.status === "Failed")
    .reduce<MockedErrorHealthCheckCountByDay[]>((accumulator, currentHealthCheck) => {
      const currentHealthCheckTime = moment(currentHealthCheck.completedAt);
      const indexOfSameDayInAcc = findIndexOfElemSameDayData(accumulator, currentHealthCheckTime);

      if (indexOfSameDayInAcc === -1) {
        accumulator.push({
          dayDate: currentHealthCheck.completedAt,
          count: 1
        });
      } else {
        accumulator[indexOfSameDayInAcc].count++;
      }

      return accumulator;
    }, [])
    .sort(sortForTimeDesc)
}

export function getAllFailedHealthChecksByDay(
  schema: MockedSchema,
  day: string
) {
  const parsedDay = moment(day);

  return schema
    .all("healthCheck")
    .models
    .filter(healthCheck => healthCheck.status === "Failed" && moment(healthCheck.completedAt).isSame(parsedDay, "day"))
}

function sortForTimeDesc(a: MockedErrorHealthCheckCountByDay, b: MockedErrorHealthCheckCountByDay) {
  const timeDiff = moment(a.dayDate).diff(moment(b.dayDate))

  if (timeDiff >= 0)
    return -1;

  return 1;
}

function findIndexOfElemSameDayData(acc: MockedErrorHealthCheckCountByDay[], healthCheckTime: moment.Moment) {
  return acc.findIndex((groupedDataElement) => {
    return healthCheckTime.isSame(groupedDataElement.dayDate, 'day');
  });
}
