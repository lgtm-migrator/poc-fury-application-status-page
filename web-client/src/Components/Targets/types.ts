import {Target} from "../types";

export interface TargetsComponentProps {
  targetList: Target[];
}

export interface TargetCardProps {
  target: Target;
  basePath: string;
}
