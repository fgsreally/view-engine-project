import { defaultRegisterModule } from "../types/types";
export let allComponentsList: any = new Map();

export function getModule<RegisterModule extends defaultRegisterModule>(
  key?: string
) {
  if (key) return (allComponentsList as Map<string, RegisterModule>).get(key);
  return allComponentsList as Map<string, RegisterModule>;
}

export function createEditorConfig<
  RegisterModule extends defaultRegisterModule
>(err?: Function) {
  //分区注册
  const componentList: RegisterModule[] = [];
  return {
    componentList,
    register: (module: RegisterModule) => {
      componentList.push(module);
      if (allComponentsList.has(module.key)) {
        err?.(module.key);
        return;
      }
      allComponentsList.set(module.key, module);
    },
  };
}
//example:
// export function registerComponent<RegisterModule extends defaultRegisterModule>(
//   RegisterCenter: registerCenter<RegisterModule>,
//   Comp: Component,
//   label: string,
//   key: string,
//   type: string,
//   propsData = {},
//   slotSet = ["default"]
// ) {RegisterCenter.register(....)}
