import deepcopy from "deepcopy";
import _ from "lodash";
import { UnwrapNestedRefs } from "vue";
import {
  defaultContainerState,
  defaultActState,
  basicBlock,
  inputBlock,
} from "../types/types";

export abstract class historyController<Data> {
  dataStack: Data[] = [];
  history: any[] = [];
  historyLength: number;
  record(historyData: any, data?: Data) {
    if (data && this.dataStack.length < this.historyLength) {
      this.dataStack.push(deepcopy(data));
    }
    this.history.push(historyData);
  }
  track(num?: number) {
    return this.dataStack[num ? num : this.dataStack.length - 1];
  }
  clearRecord(num?: number) {
    if (!num) {
      this.dataStack = [];
    } else {
      this.dataStack.splice(0, num);
    }
  }
  clearHistory(num?: number) {
    if (!num) {
      this.history = [];
    } else {
      this.history.splice(0, num);
    }
  }
}

class containerController<
  ContainerState extends defaultContainerState<Screen>,
  Screen extends string
> {
  containerState: UnwrapNestedRefs<ContainerState>;

  // get container() {
  //   return this.containerState.curContainer;
  // }
  updateContainer(key: keyof ContainerState, property: unknown) {
    _.set((this.containerState as any).containerObj, key, property);
  }
}

class actController<
  ActState extends defaultActState<BlockType>,
  BlockType extends basicBlock<BlockType>
> {
  //extends containerController<ContainerState, Screen>
  actState: UnwrapNestedRefs<ActState>;
  snapshotList: string[];

  // get clickBlock() {
  //   return this.actState.clickBlock as BlockType;
  // }
  // get hoverBlock() {
  //   return this.actState.hoverBlock as BlockType;
  // }
  // get clickDom() {
  //   return this.actState.clickDom as HTMLElement;
  // }
  $select(Block: BlockType | string, actObj: keyof ActState = "clickBlock") {
    if (typeof Block === "string") {
      Block = (this as any).find(Block);
    }
    (this.actState as any)[actObj] = Block;
  }

  $cancel(actObj: keyof ActState = "clickBlock") {
    (this.actState as any)[actObj] = null;
  }
  $update<ActKey extends keyof ActState>(
    key: ActKey,
    property: ActState[ActKey],
    actObj: keyof ActState = "clickBlock"
  ) {
    _.set((this.actState as any)[actObj], key, property);
  }

  $insert(Block: inputBlock<BlockType>, actObj: keyof ActState = "clickBlock") {
    (Block as any).parent = (this.actState as any)[actObj];
    (this.actState as any)[actObj]?.blocks.push(Block);
  }

  $exchange(
    Block: inputBlock<BlockType>,
    actObj: keyof ActState = "clickBlock"
  ) {
    let curBlock = (this.actState as any)[actObj];
    if (curBlock) {
      (Block as any).parent = curBlock.parent;
      curBlock.parent.blocks.splice(
        curBlock.parent.blocks.findIndex(
          (block: BlockType) => block.uuid === curBlock.uuid
        ),
        1,
        Block
      );
    }
  }
  $remove(id: string, actObj: keyof ActState = "clickBlock") {
    (this.actState as any)[actObj].blocks = (this.actState as any)[
      actObj
    ].blocks.filter((block: BlockType) => id !== block.uuid);
  }
  $removeAll(id: string[], actObj: keyof ActState = "clickBlock") {
    (this.actState as any)[actObj].blocks = (this.actState as any)[
      actObj
    ].blocks.filter((block: BlockType) => !id.includes(block.uuid));
  }

  $reuseShot(name: string, actObj: keyof ActState = "clickBlock") {
    (this.actState as ActState)[actObj] = {
      ...(this.actState as ActState)[actObj],
      ...(this.actState as any)[actObj].snapshot[name],
    };
  }
  $snapshot(name: string, actObj: keyof ActState = "clickBlock") {
    (this.actState as any)[actObj].snapshot[name] = _.pick(
      (this.actState as ActState)[actObj],
      this.snapshotList
    );
  }

  $selectDom(dom: HTMLElement | string, actObj: keyof ActState = "clickDom") {
    (this.actState as any)[actObj] =
      typeof dom === "string" ? document.getElementById(dom) : dom;
  }
}
