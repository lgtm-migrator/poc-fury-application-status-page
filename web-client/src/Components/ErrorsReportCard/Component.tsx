import React, {useEffect, useState} from "react";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {LocalizedText} from "./LocalizedText";
import {
  EuiText,
  EuiFlexItem,
  EuiAccordion,
  EuiFlexGroup,
  EuiBasicTable,
  EuiLoadingSpinner,
} from "fury-design-system";
import moment from "moment";
import {ErrorsReportCardComponentProps} from "./types";
import {observer} from "mobx-react";

import './Style.scss';

export default observer(ErrorsReportCardComponent);

function ErrorsReportCardComponent(props: ErrorsReportCardComponentProps) {
  const [error, setError] = useState<string>('');
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
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

  useEffect(() => {
    props.accordionOpen && loadList();
    props.accordionOpen && setAccordionOpen(true);
  }, [props.accordionOpen])

  return (
    <>
      <div className="error-card">
        <EuiFlexGroup direction="column" gutterSize="none">
          <EuiFlexGroup direction="row" responsive={false} className="error-card__header" gutterSize="none">
            <EuiFlexItem grow={1}>
              <EuiText size="s" className="error-card__date" textAlign="left" color="subdued">
                <strong>
                  {getTimeString(props.errorHealthCheckCountByDay.dayDate)}
                </strong>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={1}>
              <EuiText size="xs" className="error-card__issues-qt" textAlign="right">
                <strong>
                  {LocalizedText.singleton.issuesNumber(props.errorHealthCheckCountByDay.count)}
                </strong>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexItem className="error-card__accordion-container">
            <EuiAccordion
              id={`${props.errorsReportChecksStore.id}-accordion`}
              arrowDisplay="right"
              initialIsOpen={props.accordionOpen}
              buttonContent={accordionOpen
                ? LocalizedText.singleton.close
                : LocalizedText.singleton.open
              }
              className="error-card__accordion"
              buttonClassName="error-card__accordion-button"
              onToggle={(isOpen) => {
                isOpen
                  ? setAccordionOpen(true)
                  : setAccordionOpen(false)

                if (isOpen && typeof props.errorsReportChecksStore.errorsReportChecksList === 'undefined') {
                  loadList();
                  return;
                }
              }}
            >
              {
                isLoading
                  ?
                  <>
                    <EuiText textAlign="center"> {LocalizedText.singleton.loading} </EuiText>
                    <EuiText textAlign="center"><EuiLoadingSpinner size="l"/></EuiText>
                  </>
                  :
                  <>
                    <EuiBasicTable
                      className="error-card__table"
                      tableLayout="auto"
                      responsive={false}
                      // textOnly={true}
                      columns={[
                        {field: 'target', name: LocalizedText.singleton.service},
                        {field: 'checkName', name: LocalizedText.singleton.checkType},
                        {field: 'date', name: LocalizedText.singleton.when}
                      ]}
                      items={
                        props.errorsReportChecksStore.errorsReportChecksList
                          ? props.errorsReportChecksStore.errorsReportChecksList.map((issueElem) => {
                            return (
                              {
                                target: issueElem.target,
                                checkName: issueElem.checkName,
                                date: getRelativeTime(issueElem.completedAt)
                              }
                            )
                          })
                          : []
                      }
                    />
                  </>
              }
            </EuiAccordion>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </>
  )
}

function getRelativeTime(healthCheckTime: moment.Moment) {
  const currentServerTime = moment().utc();
  const isToday = currentServerTime.diff(healthCheckTime.utc(), "days") === 0 &&
    currentServerTime.utc().date() === healthCheckTime.utc().date();

  if (isToday) {
    // Returning diff times in hours and minutes because
    // the momentjs .from() method does not support it together
    const diffInMinutes = moment().utc().diff(healthCheckTime.utc(), 'minutes');
    if (diffInMinutes > 60) {
      const diff = moment().utc().diff(healthCheckTime.utc());
      if (moment(diff).utc().minutes() === 0) {
        return LocalizedText.singleton.timeInHours(moment(diff).utc().hours());
      }
      return LocalizedText.singleton.timeInHoursAndMinutes(moment(diff).utc().hours(), moment(diff).utc().minutes())
    }
    return LocalizedText.singleton.timeInMinutes(diffInMinutes);
  }
  return `${healthCheckTime.format('HH:mm')} UTC`;
}

function getTimeString(time: moment.Moment) {
  const currentServerTime = moment().utc();
  switch (currentServerTime.diff(time.utc(), "days")) {
    case 0:
      if (currentServerTime.date() != time.utc().date()) {
        return "Yesterday"
      }

      return "Today";
    case 1:
      if (currentServerTime.subtract(1, "days").date() === time.utc().date()) {
         return "Yesterday";
      }

      return time.format("Do MMMM");
    default:
      return time.format("Do MMMM");
  }
}
