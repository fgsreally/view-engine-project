import { Component, VNode } from "vue";

export interface defaultContainerState<Screen extends string> {
  isEdit: boolean;
  isFull: boolean;
  isGrid: boolean;
  isHelperLine: boolean;
  isHelper: boolean;
  screen: Screen;
  curContainer: any;
}
export interface defaultActState<BlockType> {
  clickBlock: null | BlockType;
  hoverBlock: null | BlockType;
  clickDom: null | HTMLElement | string;
  hoverDom: null | HTMLElement | string;
}

// type Container = {
//   [key in string]: string | number;
// };

export interface defaultData<BlockType, Screen extends string, Container> {
  container: { [key in Screen]: Container };
  blocks: BlockType[];
}

export interface basicBlock<BlockType> {
  uuid: string;
  blocks: BlockType[];
  parent: string;
}
export type inputBlock<BlockType> = Omit<BlockType, "parent"> & {
  parent?: string;
};

export interface standardBlock<BlockType> {
  parent: string; //默认parent=''时本节点为未挂载节点，为'1'时即父节点为根节点
  slot: string; //use in renderer
  decorators: []; //use in renderer 如果自定义renderer，这两可以随便处理
  key: string;
  propsData: any;
  uuid: string;
  blocks: BlockType[];
}

export interface vBlock {
  vIf: { value: boolean; required: boolean };
  vShow: { value: boolean; required: boolean };
  vFor: { value: number; required: boolean };
}

export interface defaultDecorator {
  comp: Component;
  propsData: any;
  dirct: string;
}

export type CompList<RegisterBlock> = Map<string, RegisterBlock>;
export interface defaultRegisterModule {
  key: string;
  label: string;
  type: string;
  preview: (params?: any) => VNode;
  render: (params?: any) => VNode;
  comp: Component;
}

export interface registerCenter<RegisterModule> {
  componentList: RegisterModule[];
  register(module: RegisterModule): void;
}

export interface EngineConfig {
  actionConfig?: { [key in string]: any };
  containerConfig?: { [key in string]: any };
  snapshotList?: string[];
  historyLength?: number;
}

export interface lineData {
  startNode: string;
  endNode: string;
}

export interface pointData {
  x: number;
  y: number;
}
