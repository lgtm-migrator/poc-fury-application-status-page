import React, {useContext, useEffect, useState} from "react";
import {ErrorsReportComponentProps} from "./types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {EuiEmptyPrompt, EuiLoadingSpinner, EuiPage, EuiPageContent} from "fury-design-system";
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
           <ResponsiveHeader context={appContextData} pageName={props.pageName} />
           <EuiPageContent
             verticalPosition="center"
             horizontalPosition="center"
             paddingSize="l"
             color="transparent"
             style={{ maxWidth: "600px", width: "100%" }}
             hasShadow={false}
           >
             {props.errorsReportStore.errorsReportChecksCountList.map((errorReportChecksElem, index) => {
               return (
                 <React.Fragment key={`errorCheckList-${index}`}>
                   <ErrorsReportCard errorHealthCheckCountByDay={errorReportChecksElem} />
                 </React.Fragment>
               );
             })}
           </EuiPageContent>
         </EuiPage>
     }
   </>
 )
}
