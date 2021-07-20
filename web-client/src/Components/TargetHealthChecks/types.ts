import {TargetHealthCheck} from "../types";
import {TargetHealthChecksStore} from "../../Stores/TargetHealthChecks";

export interface TargetHealthChecksContainerProps {
  target: string;
  targetTitle?: string;
  standalone?: boolean;
}

export interface TargetHealthChecksComponentProps {
  releaseNumber: string;
  targetHealthChecksStore: TargetHealthChecksStore;
  target: string;
  targetTitle?: string;
  standalone?: boolean;
}

export interface TargetHealthChecksCardProps {
  targetHealthCheck: TargetHealthCheck;
}
