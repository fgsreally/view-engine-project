import { serviceType } from "../types";

let storage: Map<string, serviceType> = new Map();
let service: Map<string, serviceType> = new Map();
let middlewares: any = new Map();
export function setService(key: string, exec: serviceType) {
  service.set(key, exec);
}

export function getService(key: string) {
  let [route, method] = key.split(":");
  if (method) {
    return service.get(key) || getStorage(method);
  } else {
    return service.get(key);
  }
}

export function setMid(key: string, exec: Function) {
  middlewares.set(key, exec);
}

export function getMid(key: string) {
  return middlewares.get(key);
}

export function setStorage(key: string, exec: serviceType) {
  storage.set(key, exec);
}

export function getStorage(key: string) {
  return storage.get(key);
}

setService("log", console.log);
