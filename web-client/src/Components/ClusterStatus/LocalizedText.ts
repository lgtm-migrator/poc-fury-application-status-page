/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { BaseLocalizedText } from '../../Services/BaseLocalizedText';

export class LocalizedText extends BaseLocalizedText {

  public static singleton = new LocalizedText();

  public get healthyStatusMessage() {
    return this.translate('Fury Cluster Status Healthy');
  }

  public get errorStatusMessage() {
    return this.translate('Fury Cluster Status Error');
  }

  public get goToClusterServicesButtonMessage() {
    return this.translate('Fury Cluster Status Go To Services')
  }
}
