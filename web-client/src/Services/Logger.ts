import { Factory } from "fury-component";

export const logger = Factory.logger(
  {
    level: process.env.APP_ENV === "production" ? "warn" : "info",
  },
  {
    // todo append client name
    name: "FURY_APPLICATION_STATUS_SINGLETON",
    // todo add client guid from process.env
  }
);
