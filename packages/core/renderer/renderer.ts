import { Component, h, VNode, vShow, withDirectives } from "vue";
import {
  CompList,
  standardBlock,
  defaultDecorator,
  defaultRegisterModule,
  vBlock,
} from "../types/types";

let decorator = (deco: defaultDecorator) => {
  return (content: VNode) =>
    h(
      deco.comp,
      { ...deco.propsData },
      {
        [deco.dirct]: content,
      }
    );
};

export class Renderer<
  BlockType extends standardBlock<BlockType>,
  RegisterModule extends defaultRegisterModule
> {
  _vnode: VNode | VNode[] | null;
  Block: BlockType;
  Comp: Component;
  Stack: { funcName: string; property: any }[];
  renderType: string;
  allComponentsList: CompList<RegisterModule>;
  slotVNode: { [key in string]: Function };
  constructor(
    Block: BlockType,
    Comp: Component,
    AllCompList: CompList<RegisterModule>,
    SlotSet: string[] = ["default"],
    RenderType: string = "render" //在注册模块中对应的方法，可能在注册模块时给了  1 编辑时的渲染方法，2 预览时的渲染方法， 3 渲染代码的方法，通过RenderType决定此时用哪一种
  ) {
    this._vnode = null;
    this.Stack = [];
    this.Block = Block;
    this.Comp = Comp;
    this.renderType = RenderType;
    this.allComponentsList = AllCompList;
    this.slotVNode = this.slotRenderer(SlotSet);
  }
  exec() {
    return this._vnode;
  }
  record(funcName: string, ...property: any) {
    this.Stack.push({ funcName, property });
  }

  slotRenderer(slotSet: string[]) {
    let slotRenderer: { [key in string]: Function } = {};
    slotSet.forEach((templateName) => {
      slotRenderer[templateName] = () =>
        this.Block.blocks.map((block: BlockType) => {
          try {
            if (block.slot === templateName) {
              return (this.allComponentsList as any)
                .get(block.key)
                [this.renderType](block);
            }
          } catch (e) {
            console.error(
              `(Method ${this.renderType} or Block ${block.key} ) may not be found in the registration module )\n`,
              e
            );
          }
        });
    });
    return slotRenderer;
  }

  main() {
    this.record("main");
    this._vnode = h(
      this.Comp,
      {
        ...this.Block.propsData,
      },
      this.slotVNode
    );
    return this;
  }
  useDecorator() {
    this.record("useDecorator");
    this._vnode = this.Block.decorators.reduce((arr, cur) => {
      return decorator(cur)(arr as VNode);
    }, this._vnode);
    return this;
  }

  useDragger(
    dragEnter: (e: DragEvent, block: BlockType) => void,
    dragOver: (e: DragEvent, block: BlockType) => void
  ) {
    (this._vnode as any).props["ondragenter"] = (e: DragEvent) =>
      dragEnter(e, this.Block);
    (this._vnode as any).props["ondragover"] = (e: DragEvent) =>
      dragOver(e, this.Block);
    return this;
  }
  useClass(className: string) {
    this.record("useClass", className);
    (this._vnode as any).props["class"] = className;
    return this;
  }
  useID(id: string) {
    (this._vnode as any).props["id"] = id;
    return this;
  }
  useValue(key: string, property: any) {
    (this._vnode as any).props[key] = property;
    return this;
  }
  box() {
    this._vnode = h("div", { default: () => [this._vnode] });
    return this;
  }
  vFor() {
    let _vnode: VNode[] = [this._vnode as VNode];
    if ((this.Block as BlockType & vBlock).vFor.required) {
      for (let i = 1; i < (this.Block as BlockType & vBlock).vFor.value; i++) {
        this.Stack.forEach((item) => {
          (this as any)[item.funcName](...item.property);
        });
        _vnode.push(this._vnode as VNode);
      }
    }
    this._vnode = _vnode;
    return this;
  }
  vIf() {
    if (
      (this.Block as BlockType & vBlock).vIf.required &&
      !(this.Block as BlockType & vBlock).vIf.value
    ) {
      this._vnode = null;
    }

    return this;
  }
  vShow() {
    this._vnode = withDirectives(this._vnode as VNode, [
      [vShow, (this.Block as BlockType & vBlock).vShow.value],
    ]);
    return this;
  }
}
