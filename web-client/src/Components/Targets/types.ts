import {Target} from "../types";
import {TargetsStore} from "../../Stores/Targets";

export interface TargetsComponentProps {
  targetsStore: TargetsStore;
}

export interface TargetCardProps {
  target: Target;
  basePath: string;
}
