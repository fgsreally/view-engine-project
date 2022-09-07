import { JSONSchemaType, Schema } from "ajv";
import { Request } from "express";

export type optionItem = {
  middlewares: string[];
};

export type fschemaConfig = {
  keywords: string[];
  formats: string[];
  category: string[];
  schema: { [key in string]: Schema };
};

export type serviceType = (req: Request, key: string) => any;

export type categoryItem = { schema: any; database?: any; prompt?: any[] };
