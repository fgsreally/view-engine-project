import deepcopy from "deepcopy";
import _ from "lodash";
import { reactive, UnwrapNestedRefs, ref, Ref, UnwrapRef } from "vue";
import {
  defaultActState,
  basicBlock,
  defaultContainerState,
  defaultData,
  EngineConfig,
  inputBlock,
} from "../types/types";
export const namespace: Map<string, unknown> = new Map();

export class Engine<
  DataState extends defaultData<BlockType, Screen, Container>, //单例，整体的json
  ActState extends defaultActState<BlockType>, //单例，操作中的block与dom
  ContainerState extends defaultContainerState<Screen>, //单例，操作中的容器相关变量
  BlockType extends basicBlock<BlockType>, //每个block的类型，可以往上面加需要的属性
  Screen extends string, //几种类型的屏幕
  Container extends { [key in string]: string | number } //每个屏幕的类型，宽高，字体等等
> {
  source: Ref<UnwrapRef<DataState>>;
  blockMap: Map<string, BlockType>;
  actState: UnwrapNestedRefs<ActState>;
  snapshotList: string[];
  containerState: UnwrapNestedRefs<ContainerState>;
  dataStack: DataState[] = [];
  history: any[] = [];
  historyLength: number;
  constructor(data: DataState, config: EngineConfig = {}) {
    // super(config);
    this.actState = reactive<any>({
      ...{
        clickBlock: null,
        hoverBlock: null,
        clickDom: null,
        hoverDom: null,
      },
      ...(config.actionConfig || {}),
    });
    this.snapshotList = config.snapshotList || [];
    this.containerState = reactive<any>({
      ...{
        isEdit: true,
        isFull: false,
        isGrid: true,
        isHelperLine: true,
        isHelper: true,
        screen: "normal",
        curContainer: null,
      },
      ...(config.containerConfig || {}),
    });
    this.source = ref<DataState>(data);
    this.blockMap = new Map();
    this.blockMap.set("1", this.source.value as any);
    this.historyLength = config.historyLength || 10;
  }
  record(historyData: any, data?: DataState) {
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
  get data() {
    return this.source.value as DataState;
  }
  // _initTraverse(data: any) {
  //   data.blocks.forEach((block: any) => {
  //     block.parent = data;
  //     this._initTraverse(block);
  //   });
  // }
  get clickBlock() {
    return this.actState.clickBlock as BlockType;
  }
  get hoverBlock() {
    return this.actState.hoverBlock as BlockType;
  }
  get clickDom() {
    return this.actState.clickDom as HTMLElement;
  }
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

  get container() {
    return this.containerState.curContainer;
  }
  updateContainer(key: keyof ContainerState, property: unknown) {
    _.set((this.containerState as any).containerObj, key, property);
  }
  load(data: DataState) {
    //for json storage
    // this._initTraverse(data);
    (this.source as any).value = data;
    this.blockMap.set("1", this.source.value as any);
  }

  _create(Block: inputBlock<BlockType>) {
    this.blockMap.set(Block.uuid, Block as any);
    return this;
  }

  find(BlockOrID: string | BlockType) {
    if (typeof BlockOrID === "string") {
      return this.blockMap.get(BlockOrID);
    } else {
      return this.blockMap.has(BlockOrID.uuid) ? BlockOrID : false;
    }
  }

  parent(BlockOrID: string | BlockType) {
    let block = this.find(BlockOrID);
    return block && this.blockMap.get(block.parent);
  }

  add(
    Block: inputBlock<BlockType> | inputBlock<BlockType>[],
    BlockOrID?: string | BlockType
  ) {
    if (Array.isArray(Block)) {
      Block.forEach((block) => {
        this.add(block, BlockOrID);
      });
    } else {
      this._create(Block);
      if (!BlockOrID) {
        this.source.value.blocks.push(Block as any);
        Block.parent = "1";
      } else {
        if (typeof BlockOrID === "string") {
          let parent = this.blockMap.get(BlockOrID);

          this.record(
            {
              type: "add",
              node: Block,
              id: BlockOrID,
              timestamp: Date.now(),
            },
            this.data
          );
          if (parent) {
            Block.parent = BlockOrID;

            parent.blocks.push(Block as BlockType);
          }
        } else {
          this.record(
            {
              type: "add",
              node: Block,
              id: BlockOrID.uuid,
              timestamp: Date.now(),
            },
            this.data
          );
          BlockOrID.blocks.push(Block as BlockType);
          Block.parent = BlockOrID.uuid;
        }
      }
    }

    return this;
  }
  _insert(
    Block: inputBlock<BlockType> | inputBlock<BlockType>[],
    BlockOrID: string | BlockType,
    type: "before" | "after"
  ) {
    let keyBlock = this.find(BlockOrID);
    if (!keyBlock) return false;
    let parent = this.blockMap.get((keyBlock as BlockType).parent);

    (parent as BlockType).blocks.splice(
      (parent as BlockType).blocks.findIndex(
        (block) => block.uuid === (keyBlock as BlockType).uuid
      ) +
        type ===
        "before"
        ? 0
        : 1,
      0,
      Array.isArray(Block) ? { ...(Block as any) } : Block
    );
    if (Array.isArray(Block)) {
      this.record(
        {
          type: "addGroup",
          node: Block,
          id: (parent as BlockType).uuid,
          timestamp: Date.now(),
        },
        this.data
      );
      Block.forEach((block) => {
        block.parent = (parent as BlockType).uuid;
        this._create(block);
      });
    } else {
      this.record(
        {
          type: "add",
          node: Block,
          id: (parent as BlockType).uuid,
          timestamp: Date.now(),
        },
        this.data
      );
      Block.parent = (parent as BlockType).uuid;
      this._create(Block);
    }

    return this;
  }
  insertBeforeBlockType(
    Block: inputBlock<BlockType> | inputBlock<BlockType>[],
    BlockOrID: string | BlockType
  ) {
    this._insert(Block, BlockOrID, "before");
  }
  insertAfter(
    Block: inputBlock<BlockType> | inputBlock<BlockType>[],
    BlockOrID: string | BlockType
  ) {
    this._insert(Block, BlockOrID, "after");
  }

  traverse(Block: BlockType, cb: Function) {
    Block.blocks.forEach((item) => {
      cb(item);
      this.traverse(item, cb);
    });
  }
  remove(BlockOrID: string | BlockType) {
    let Block = this.find(BlockOrID) as BlockType;
    if (Block) {
      let parent = this.find(Block.parent) as any;
      if (parent) {
        this.record(
          {
            type: "del",
            id: typeof BlockOrID === "string" ? BlockOrID : BlockOrID.uuid,
            timestamp: Date.now(),
          },
          this.data
        );

        this.traverse(Block, (block:BlockType) => {
          this.blockMap.delete(block.uuid);
        });
        let uuid = Block.uuid;
        parent.blocks = parent.blocks.filter((block:BlockType) => {
          return block.uuid !== uuid;
        });
        this.blockMap.delete(Block.uuid);
      }
    }
  }

  removeAll(BlockOrID: string | BlockType) {
    let parentBlock = this.find(BlockOrID);

    if (parentBlock) {
      this.record(
        {
          type: "delGroup",
          id: parentBlock.uuid,
          timestamp: Date.now(),
        },
        this.data
      );
      parentBlock.blocks.forEach((block) => {
        this.blockMap.delete(block.uuid);
      });
      parentBlock.blocks = [];
      return this;
    }
    return this;
  }

  exchange(
    BlockOrID1: string | BlockType,
    BlockOrID2: string | BlockType | inputBlock<BlockType>
  ) {
    let Block1 = this.find(BlockOrID1);
    let Block2 = this.find(BlockOrID2 as any);
    if (!Block1) return false;
    if (Block2) {
      this.record(
        {
          type: "exchange",
          id: [Block1.uuid, Block2.uuid],
          timestamp: Date.now(),
        },
        this.data
      );
      let parent = Block1.parent;
      Block1.parent = Block2.parent;
      Block2.parent = parent;
      (this.parent(Block1) as any).blocks = (
        this.parent(Block1) as any
      ).blocks.map((block: BlockType) =>
        block.uuid === (Block1 as BlockType).uuid ? Block2 : block
      );
      (this.parent(Block2) as any).blocks = (
        this.parent(Block2) as any
      ).blocks.map((block: BlockType) =>
        block.uuid === (Block2 as BlockType).uuid ? Block1 : block
      );
    } else {
      if (typeof BlockOrID2 === "string") return false;
      this.record(
        {
          type: "replace",
          id: Block1.uuid,
          node: BlockOrID2,
          timestamp: Date.now(),
        },
        this.data
      );
      (BlockOrID2 as BlockType).parent = Block1.parent;
      (this.parent(Block1) as any).blocks = (
        this.parent(Block1) as any
      ).blocks.map((block: BlockType) =>
        block.uuid === (Block1 as BlockType).uuid ? Block2 : block
      );
      this.blockMap.delete(Block1.uuid);
      this._create(BlockOrID2 as BlockType);
    }
    return this;
  }
}
