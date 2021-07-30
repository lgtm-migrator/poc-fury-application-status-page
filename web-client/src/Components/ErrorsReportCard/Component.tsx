import React, {useState} from "react";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {
  EuiText,
  EuiFlexItem,
  EuiAccordion,
  EuiFlexGroup,
  EuiBasicTable,
  EuiEmptyPrompt,
  EuiLoadingSpinner,
} from "fury-design-system";
import moment from "moment";
import {ErrorsReportCardComponentProps} from "./types";
import {observer} from "mobx-react";

import './Style.scss';

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
      <div className="error-card">
        <EuiFlexGroup direction="column">
          <EuiFlexGroup direction="row" responsive={false} className="error-card__header">
            <EuiFlexItem grow={false}>
              <EuiText size="s" className="" textAlign="left" color="subdued">
                <strong>
                  {getTimeString(props.errorHealthCheckCountByDay.dayDate)}
                </strong>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText size="s" className="" textAlign="right" color="subdued">
                <strong>
                  {`${props.errorHealthCheckCountByDay.count} ISSUES`}
                </strong>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexItem>
            <EuiAccordion
              // paddingSize="xs"
              id={`${props.errorsReportChecksStore.id}.accordion`}
              // arrowDisplay="right"
              // initialIsOpen={true}
              buttonContent="Open"
              className="error-card__accordion"
              buttonClassName="error-card__accordion-button"
              onToggle={(isOpen) => {
                if (isOpen && typeof props.errorsReportChecksStore.errorsReportChecksList === 'undefined') {
                  loadList();
                  return;
                }
              }}
            >
              {
                isLoading
                ?
                  <EuiEmptyPrompt
                    title={<h4> Loading... </h4>}
                    body={<EuiLoadingSpinner size="xl" />}
                  />
                :
                  <>
                    <EuiBasicTable
                      responsive={false}
                      columns={[
                        {field: 'target', name: 'Service'},
                        {field: 'checkName', name: 'check type'},
                        {field: 'date', name: 'when'}
                      ]}
                      items={
                        props.errorsReportChecksStore.errorsReportChecksList
                        ? props.errorsReportChecksStore.errorsReportChecksList.map((prova) => {
                          return (
                            {
                              target: prova.target,
                              checkName: prova.checkName,
                              date: prova.completedAt.format("HH:MM Z")
                            }
                          )
                          })
                        : []
                      }
                      >
                      </EuiBasicTable>
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
