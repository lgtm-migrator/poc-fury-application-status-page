/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect, useState} from "react";
import {ErrorsReportComponentProps} from "./types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import { LocalizedText } from "./LocalizedText";
import {EuiEmptyPrompt, EuiLoadingSpinner, EuiPage, EuiFlexGroup, EuiSpacer, EuiPageBody, EuiText} from "fury-design-system";
import {ResponsiveHeader} from "../ResponsiveHeader";
import moment from "moment";
import {observer} from "mobx-react";
import {ErrorsReportCard} from "../ErrorsReportCard";

export default observer(ErrorsReportComponent);

function ErrorsReportComponent(props: ErrorsReportComponentProps) {
  const appContextData = useContext(ApplicationContext);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  let reportDays: number = props.errorsReportStore.errorsReportChecksCountList.length;

  useErrorHandler(error);

  useEffect(() => {
    props.errorsReportStore.errorsReportChecksCountListGetAll()
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
      })
  }, [])


 return (
   <>
     {
       isLoading
       ? <EuiEmptyPrompt
           title={<h4> {LocalizedText.singleton.loading} </h4>}
           body={<EuiLoadingSpinner size="xl" />}
         />
       : <EuiPage paddingSize="none" restrictWidth={true}>
          <EuiPageBody>
            <ResponsiveHeader context={appContextData} pageName={props.pageName} />
            <EuiSpacer size="xxl" />
            <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
              {
                props.errorsReportStore.errorsReportChecksCountList.length &&
                <div style={{ padding: '0 16px' }}>
                  <EuiText size="m" color="subdued" textAlign="left">
                    <i>{
                      reportDays > 1
                      ? LocalizedText.singleton.errorsReportSubtitleMultiple(reportDays)
                      : LocalizedText.singleton.errorsReportSubtitleSingle
                    }</i>
                  </EuiText>
                  <EuiSpacer size="l" />
                </div>
              }
              {
                props.errorsReportStore.errorsReportChecksCountList.map((errorReportChecksElem, index) => {
                  return (
                    <React.Fragment key={`errorCheckList-${index}`}>
                      <ErrorsReportCard
                        accordionOpen={index === 0}
                        errorHealthCheckCountByDay={errorReportChecksElem}
                      />
                    </React.Fragment>
                  );
                })
              }
              {
                props.errorsReportStore.errorsReportChecksCountList.length &&
                <>
                  <EuiSpacer size="m" />
                  <EuiText size="s" color="subdued" textAlign="center">
                    <i>End of the report</i>
                  </EuiText>
                  <EuiSpacer size="m" />
                </>
              }
            </div>

          </EuiPageBody>
         </EuiPage>
     }
   </>
 )
}
