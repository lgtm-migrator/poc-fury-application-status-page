/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import i18n from "../i18n";

export class BaseLocalizedText {
  protected readonly translator: typeof i18n;

  protected readonly translate: (key: string) => string;

  constructor() {
    this.translator = i18n;
    this.translate = (key) => i18n.t(key);
  }

  public changeLanguage(language: string) {
    return this.translator.changeLanguage(language);
  }
}
