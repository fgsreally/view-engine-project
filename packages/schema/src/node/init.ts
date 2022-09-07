import express, { Application } from "express";

import { initRouter } from "./router";
import { addSchema } from "../share/schemaUtils";
import { fschemaConfig } from "../types";

export function initApp(opt: fschemaConfig, app?: Application) {
  if (!app) {
    app = express();
  }

  for (let i in opt.schema) {
    addSchema(i, opt.schema[i]);
    app.use(`/${i}`, initRouter(opt.schema[i], i));
  }
  return app;
}
