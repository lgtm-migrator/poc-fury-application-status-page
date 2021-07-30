/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect, useState} from "react";
import {ErrorsReportComponentProps} from "./types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {EuiEmptyPrompt, EuiLoadingSpinner, EuiPage, EuiPageContent, EuiSpacer, EuiPageBody} from "fury-design-system";
import {ResponsiveHeader} from "../ResponsiveHeader";
import moment from "moment";
import {observer} from "mobx-react";
import {ErrorsReportCard} from "../ErrorsReportCard";

export default observer(ErrorsReportComponent);

function ErrorsReportComponent(props: ErrorsReportComponentProps) {
  const appContextData = useContext(ApplicationContext);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
           title={<h4> Loading... </h4>}
           body={<EuiLoadingSpinner size="xl" />}
         />
       : <EuiPage paddingSize="none" restrictWidth={true}>
          <EuiPageBody>
            <ResponsiveHeader context={appContextData} pageName={props.pageName} />
            {/* <EuiPageContent
              verticalPosition="center"
              horizontalPosition="center"
              paddingSize="none"
              color="transparent"
              // style={{ maxWidth: "600px", width: "100%" }}
              hasShadow={false}
            > */}
            <EuiSpacer size="xxl" />
              {props.errorsReportStore.errorsReportChecksCountList.map((errorReportChecksElem, index) => {
                return (
                  <React.Fragment key={`errorCheckList-${index}`}>
                    <ErrorsReportCard errorHealthCheckCountByDay={errorReportChecksElem} />
                  </React.Fragment>
                );
              })}
            {/* </EuiPageContent> */}
          </EuiPageBody>
         </EuiPage>
     }
   </>
 )
}
