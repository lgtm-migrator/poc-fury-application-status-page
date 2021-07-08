import React, { useState } from "react";
import { releaseNumber } from "../../constants";
import { createStateHandler } from "../../Services/createStateHandler";
import ApplicationStatusComponent from "./Component";
import { logger } from "../../Services/Logger";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {StateManager} from "fury-component/dist/State/types";
import {IStateHandler} from "../types";

interface ApplicationStatusContainerProps {
  apiUrl?: string;
}

function getBasePath(stateHandler: StateManager<IStateHandler>) {
  if (stateHandler.getBasePath) {
    return stateHandler.getBasePath();
  }

  return "";
}

function getIsMocked(stateHandler: StateManager<IStateHandler>): boolean {
  if (stateHandler.getMocked) {
    return stateHandler.getMocked();
  }

  return process.env.APP_ENV === "development";
}

const ApplicationStatusContainer = (props: ApplicationStatusContainerProps) => {
  const stateHandler = createStateHandler();

  if(props.apiUrl) {
    stateHandler.setState({
      apiurl: props.apiUrl
    })
  }

  logger.info(JSON.stringify(stateHandler.getState()));

  const [currentLanguage] = useState<string>(stateHandler.getLanguage());
  const [basePath] = useState<string>(getBasePath(stateHandler));
  const [apiUrl] = useState<string>(stateHandler.getState().apiurl);
  const isMocked = getIsMocked(stateHandler);

  if (isMocked) {
    logger.info(stateHandler.getState().apiurl);
    makeServer({ environment: "development" }, 'scenario1', stateHandler.getState().apiurl)
  }

  return (
    <>
      <ApplicationStatusComponent
        language={currentLanguage}
        releaseNumber={releaseNumber}
        basePath={basePath}
        apiUrl={apiUrl}
      />
    </>
  );
};

export default ApplicationStatusContainer;

