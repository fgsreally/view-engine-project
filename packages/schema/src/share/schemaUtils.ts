import Ajv, { Schema } from "ajv";

import addFormats from "ajv-formats";
import { categoryItem } from "../types";

export const instance = new Ajv();
addFormats(instance);
export let schemaMap: any = {};
export function addSchema(key: string, schema: Schema) {
  let validation = instance.compile(schema);
  schemaMap[key] = validation;
  return instance.compile(schema);
}

export function getSchema(key: string) {
  return schemaMap[key];
}

export let categoryMap: {
  [key in string]: categoryItem;
} = {};

export function addKeyword(keyConf: any) {
  for (let i in keyConf) {
    instance.addKeyword(Object.assign({ keyword: i }, keyConf[i]));
  }
}

export function addFormat(formatConf: any) {
  for (let i in formatConf) {
    instance.addFormat(i, formatConf[i]);
  }
}

export function addCategory(categoryConf: { [key in string]: categoryItem }) {
  for (let i in categoryConf) {
    categoryMap[i] = categoryConf[i];
  }
}

export function addDefaultFormat(keyword: string | string[]) {
  if (Array.isArray(keyword)) {
    keyword.forEach((i) => {
      if (i in instance.RULES.keywords) return;
      instance.addKeyword({
        keyword: i,
        validate: () => {
          return true;
        },
        errors: false,
      });
    });
  } else {
    if (keyword in instance.RULES.keywords) return;
    instance.addKeyword({
      keyword: keyword,
      validate: () => {
        return true;
      },
      errors: false,
    });
  }
}
