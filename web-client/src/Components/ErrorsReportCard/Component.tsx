import React, {useState} from "react";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {
  EuiAccordion,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiPanel, EuiText
} from "fury-design-system";
import moment from "moment";
import {ErrorsReportCardComponentProps} from "./types";
import {observer} from "mobx-react";

export default observer(ErrorsReportCardComponent);

function ErrorsReportCardComponent(props: ErrorsReportCardComponentProps) {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useErrorHandler(error);

  function loadList() {
    props.errorsReportChecksStore.errorsReportChecksListGetAll()
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
      })
  }

  return (
    <>
      <EuiPanel paddingSize="s" className="service-card">
        <EuiFlexGroup gutterSize="l">
          <EuiFlexItem grow={false}>
            <EuiText size="s" className="service-name">
              <p>
                <strong>{getTimeString(props.errorHealthCheckCountByDay.dayDate)}</strong>
              </p>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiText size="s" className="service-name">
              <p>
                <strong>{`${props.errorHealthCheckCountByDay.count} ISSUES`}</strong>
              </p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiAccordion
          paddingSize="xs"
          id={`${props.errorsReportChecksStore.id}.accordion`}
          buttonContent={"Open"}
          className="accordion-logs"
          buttonClassName="accordion-button"
          onToggle={(isOpen) => {
            if (isOpen && typeof props.errorsReportChecksStore.errorsReportChecksList === 'undefined') {
              loadList();
              return;
            }
          }}
        >
          {
            isLoading ?
              <EuiEmptyPrompt
                title={<h4> Loading... </h4>}
                body={<EuiLoadingSpinner size="xl" />}
              /> :
              <>
                {props.errorsReportChecksStore.errorsReportChecksList?.map((prova) => {
                  return (
                    <>
                      <div>{prova.target}</div>
                      <div>{prova.checkName}</div>
                      <div>{prova.completedAt.format("HH:MM Z")}</div>
                    </>
                  )
                })}
              </>
          }
        </EuiAccordion>
      </EuiPanel>
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
