import React, {useContext, useEffect, useState} from "react";
import {ErrorsReportComponentProps} from "./types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {EuiEmptyPrompt, EuiLoadingSpinner, EuiPage, EuiPageContent} from "fury-design-system";
import {ResponsiveHeader} from "../ResponsiveHeader";
import moment from "moment";

export default function ErrorsReportComponent(props: ErrorsReportComponentProps) {
  const appContextData = useContext(ApplicationContext);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useErrorHandler(error);

  useEffect(() => {
    props.errorsReportStore.errorsReportChecksListGetAll()
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
             {props.errorsReportStore.errorsReportChecksList.map((errorReportChecks, index) => {
               return (
                 <React.Fragment key={`errorCheckList-${index}`}>
                   <div>
                     {getTimeString(errorReportChecks.dayDate)}
                     {`${errorReportChecks.count} ISSUES`}
                   </div>
                 </React.Fragment>
               );
             })}
           </EuiPageContent>
         </EuiPage>
     }
   </>
 )
}

function getTimeString(time: moment.Moment) {
  const currentServerTime = moment().utcOffset(time.format("Z"));

  switch(currentServerTime.diff(time, "days")) {
    case 0:
      return "Today";
    case 1:
      return "Yesterday";
    default:
      return time.format("Do MMMM")
  }
}
