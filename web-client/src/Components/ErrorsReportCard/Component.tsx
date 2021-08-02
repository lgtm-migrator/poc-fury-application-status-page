import React, {useEffect, useState} from "react";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import { LocalizedText } from "./LocalizedText";
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
                  {`${props.errorHealthCheckCountByDay.count} ISSUES`}
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
                    <EuiText textAlign="center"><EuiLoadingSpinner size="l" /></EuiText>
                  </>
                :
                  <>
                    <EuiBasicTable
                      className="error-card__table"
                      tableLayout="auto"
                      responsive={false}
                      // textOnly={true}
                      columns={[
                        {field: 'target', name: 'SERVICE'},
                        {field: 'checkName', name: 'CHECK TYPE'},
                        {field: 'date', name: 'WHEN'}
                      ]}
                      items={
                        props.errorsReportChecksStore.errorsReportChecksList
                        ? props.errorsReportChecksStore.errorsReportChecksList.map((prova) => {
                          return (
                            {
                              target: prova.target,
                              checkName: prova.checkName,
                              date: `${prova.completedAt.format('HH:mm')} UTC`
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

function getTimeString(time: moment.Moment) {
  const currentServerTime = moment().utc();

  switch(currentServerTime.diff(time.utc(), "days")) {
    case 0:
      if (currentServerTime.utc().date() != time.utc().date()) {
        return "Yesterday"
      }

      return "Today";
    case 1:
      return "Yesterday";
    default:
      return time.format("Do MMMM")
  }
}
