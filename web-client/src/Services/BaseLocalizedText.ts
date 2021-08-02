/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import i18n from "../i18n";

interface TranslationParams {
  [key:string]: string;
}

export class BaseLocalizedText {
  protected readonly translator: typeof i18n;

  protected readonly translate: (key: string, params?: TranslationParams) => string;

  constructor() {
    this.translator = i18n;
    this.translate = (key, params) => {
      if (params) {
        return i18n.t(key, params);
      }

      return i18n.t(key);
    }
  }

  public timeInHoursAndMinutes(hours: number, minutes: number) {
   return this.translate("Target Health Checks Status Time Hours And Minutes", {hours: hours.toString(), minutes: minutes.toString()})
  }

  public timeInHours(hours: number) {
    return this.translate("Target Health Checks Status Time Hours", {hours: hours.toString()})
  }

  public timeInMinutes(minutes: number) {
    return this.translate("Target Health Checks Status Time Minutes", {minutes: minutes.toString()})
  }

  public changeLanguage(language: string) {
    return this.translator.changeLanguage(language);
  }

  public get goBack() {
    return this.translate('Back')
  }

  public get open() {
    return this.translate('Open')
  }

  public get close() {
    return this.translate('Close')
  }

  public get loading() {
    return this.translate('Loading')
  }

  public get errorsReportSubtitleSingle() {
    return this.translate('Errors Report Subtitle Single')
  }

  public errorsReportSubtitleMultiple(reportDays: number) {
    return this.translate('Errors Report Subtitle Multiple', {reportDays: reportDays.toString()})
  }
  
}
