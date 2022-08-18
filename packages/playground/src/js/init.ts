import {
  Engine,
  defaultActState,
  defaultContainerState,
} from "@fgsreally/view-engine";

type Screen = "normal" | "special";

export interface BlockType {
  parent: string;
  uuid: string;
  key: string;
  propsData: any;
  x: number;
  y: number;
  blocks: BlockType[];
}

interface dataState {
  blocks: BlockType[];
  container: { [key in Screen]: { width: number; height: number } };
}
type Container = {
  width: number;
  height: number;
};

let data: dataState = {
  container: {
    normal: { width: 550, height: 450 },
    special: { width: 1000, height: 600 },
  },
  blocks: [],
};

export let instance = new Engine<
  dataState,
  defaultActState<BlockType>,
  defaultContainerState<Screen>,
  BlockType,
  Screen,
  Container
>(data);
