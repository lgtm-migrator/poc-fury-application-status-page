/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { BaseLocalizedText } from '../../Services/BaseLocalizedText';

export class LocalizedText extends BaseLocalizedText {
  public static singleton = new LocalizedText();

  public get errorStatusMessage() {
    return this.translate('Target Status Error');
  }

  public get goToTargetHealthChecksButtonMessage() {
    return this.translate('Target Status Go To Health Checks')
  }

  public healthyStatusMessage(group: string) {
    return this.translate('Target Status Healthy', {group: group});
  }
}
