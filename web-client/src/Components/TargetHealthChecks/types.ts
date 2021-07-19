import {TargetHealthCheck} from "../types";

export interface TargetHealthChecksContainerProps {
  target: string;
  targetTitle?: string;
  standalone?: boolean;
}

export interface TargetHealthChecksComponentProps {
  releaseNumber: string;
  targetHealthChecksList: TargetHealthCheck[];
  target: string;
  targetTitle?: string;
  standalone?: boolean;
}

export interface TargetHealthChecksCardProps {
  targetHealthCheck: TargetHealthCheck;
}
