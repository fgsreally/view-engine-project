import express, { NextFunction, Request, Response, Router } from "express";
import createError from "http-errors";
import { crudMethod, validate } from "./schema";
import { getService } from "./service";
import { optionItem } from "../types";

let log = getService("log") as Function;

export function initRouter(opt: any, key: string): Router {
  let Router = express.Router();

  if (Array.isArray(opt.middlewares)) {
    Router.use(opt.middlewares.map((item: string) => getService(item)));
  }

  if (!(opt.find === false)) {
 
    Router.get("/", ...handler(opt.find, key, "find"));
  }

  if (!(opt.findOne === false)) {
    Router.get("/:id", ...handler(opt.findOne, key, "findOne"));
  }
  if (!(opt.delete === false)) {
    Router.delete("/:id", ...handler(opt.delete, key, "delete"));
  }

  if (!(opt.update === false)) {
    Router.put("/:id", ...handler(opt.update, key, "update"));
  }
  if (!(opt.create === false)) {
    Router.post("/", ...handler(opt.update, key, "create"));
  }
  return Router;
}

function handler(opt: optionItem | undefined, key: string, method: crudMethod) {
  let handler: any;
  if (opt) {
    handler = opt.middlewares
      ? opt.middlewares
          .map((item) => getService(item))
          .filter((item: Function | undefined) => item)
      : [];
  } else {
    handler = [];
  }

  handler.push(async (req: Request, res: Response, next: NextFunction) => {
    let valid = validate(key, method, req);

    if (valid) {
      try {
        let service = getService(`${key}:${method}`);
        if (!service) {
          throw new Error(`no such service --${key}:${method}`);
        }
        let ret = await service(req, key);

        res.json(ret);
      } catch (e: any) {
        if (e.message.startsWith(`no such service`)) {
          log(e.message);
          next(createError(500));
        } else {
          next(createError(400));
        }
      }
    } else {
      next(createError(400));
    }
  });
  return handler;
}
