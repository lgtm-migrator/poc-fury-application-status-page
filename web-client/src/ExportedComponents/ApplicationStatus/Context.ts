import { createContext } from "react";
import { IApplicationContext } from "./types";

export default createContext<IApplicationContext>({
  language: "",
  releaseNumber: "",
  basePath: "",
  apiUrl: "",
  groupLabel: "",
  cascadeFailure: 1,
});
