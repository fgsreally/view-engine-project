import { Schema } from "ajv";
import { Component } from "vue";
export * from "../share/schemaUtils";
export let allCompList: { [key in string]: Component } = {};
export function registerComp(
  key: string,
  comp: Component | (() => Promise<Component>)
) {
  allCompList[key] = comp;
}

export let allExecList: {
  [key in string]: {
    [key in string]: Function;
  };
} = {};

export function registerExec(path: string, key: string, exec: Function) {
  if (!allExecList[key]) {
    allExecList[key] = {};
  }
  allExecList[key][path] = exec;
}

export function invokeExec(path: string, key: string, params: any) {
  allExecList[key][path](params);
}

let renderRule;
export function setRule<S extends Schema>(rule: (opt: S) => string) {
  renderRule = rule;
}

export function getRule() {
  return renderRule;
}
