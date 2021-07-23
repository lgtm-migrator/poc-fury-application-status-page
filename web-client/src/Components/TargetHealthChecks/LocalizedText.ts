/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { BaseLocalizedText } from '../../Services/BaseLocalizedText';

export class LocalizedText extends BaseLocalizedText {
  public static singleton = new LocalizedText();

  public healthyStatusMessage(group: string, target: string) {
    return this.translate('Target Health Checks Status Healthy', {group: group, target: target});
  }

  public errorStatusMessage(checkNum: number, group: string, target: string) {
    return this.translate('Target Health Checks Status Error', {checkNum: checkNum.toString(), group: group, target: target});
  }

  public get lastCheckIsNow() {
    return this.translate('Target Health Checks Status Last Check Now');
  }

  public get lastCheck() {
   return this.translate('Target Health Checks Status Last Check');
  }

  public get lastIssue() {
    return this.translate('Target Health Checks Status Last Issue');
  }

  public get occurringIssue() {
    return this.translate('Target Health Checks Status Error Occurring');
  }

  public get neverAnIssue() {
    return this.translate('Target Health Checks Status Error Never');
  }

  public get errorOccurredAt() {
    return this.translate('Target Health Checks Status Error Occurred');
  }

  public get goBack() {
    return this.translate('Target Health Checks Status Go Back')
  }
}
