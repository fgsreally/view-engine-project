import { resolve } from "path";

export let defaultCategory = {
  string: {
    schema: { type: "string" },
    prompt: [
      {
        type: "input",
        message: "(keyword) 输入范围",
        name: "range",
      },
    ],
  },
  // text: { type: "string" },
  // richtext: { type: "string" },
  // json: { type: "string", isJson: true },
  // enumeration: { enum: [] },
  // password: { format: "password" },
  // email: { format: "email" },
  // integer: { type: "integer" },
  // float: { format: "float" },
  // date: { format: "date" },
  // time: { format: "time" },
  // url: { format: "url" },
  // datetime: { format: "date-time" },
  // timestamp: { type: "number" },
  // boolean: { type: "boolean" },
};

export let defaultPrompt = {
  string: { type: "string" },
  text: { type: "string" },
  richtext: { type: "string" },
  json: { type: "string", isJson: true },
  enumeration: { enum: [] },
  password: { format: "password" },
  email: { format: "email" },
  integer: { type: "integer" },
  float: { format: "float" },
  date: { format: "date" },
  time: { format: "time" },
  url: { format: "url" },
  datetime: { format: "date-time" },
  timestamp: { type: "number" },
  boolean: { type: "boolean" },
};
export let NO_SCHEMA_KEY = {
  validate(schema: any, data: any) {
    return true;
  },
};

export let defaultKey = {
  middlewares: {
    validate(schema: any, data: any) {
      if (Array.isArray(schema)) {
        return true;
      }
    },
  },
  find: NO_SCHEMA_KEY,
  findOne: NO_SCHEMA_KEY,
  delete: NO_SCHEMA_KEY,
  update: NO_SCHEMA_KEY,
  create: NO_SCHEMA_KEY,
  isJson: {
    validate: (schema: any, data: any) => {
      if (schema) {
        try {
          JSON.parse(data);
          return true;
        } catch (e) {
          return false;
        }
      }
    },
  },
};

export let defaultFormat = {};

export let DEFAULT_CONFIG = {
  schema: {},
  keywords: [],
  formats: [],
  category: [],
};

export let configPath = resolve(process.cwd(), "Fconfig.json");
export let addonPath = resolve(process.cwd(), "FAddon.js");
