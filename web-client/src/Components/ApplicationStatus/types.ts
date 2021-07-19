import {Config} from "../types";

export interface ApplicationStatusContainerProps extends Omit<Config, "apiUrl"> {
  apiUrl?: string;
}

export interface ApplicationStatusRouteParams {
  target: string;
}

export interface IApplicationContext {
  language: string;
  releaseNumber: string;
  basePath: string;
  apiUrl: string;
  cascadeFailure: number;
  groupLabel: string;
  groupTitle?: string;
  targetLabel?: string;
  targetTitle?: string;
}