import { ValidateFunction } from "ajv";
import { Request } from "express";

import { schemaMap } from "../share/schemaUtils";

export type crudMethod = "find" | "findOne" | "update" | "delete" | "create";
export function validate(key: string, mode: crudMethod, req: Request) {
  switch (mode) {
    case "find":
      return (schemaMap[key] as ValidateFunction)(req.query);
    case "update":
      return (schemaMap[key] as ValidateFunction)(req.body);
    case "create":
      return (schemaMap[key] as ValidateFunction)(req.body);
    default:
      return true;
  }
}
