import { createVNode, render, VNode } from "vue";
import ContextMenu from "./ContextMenu.vue";

let ctxMap = new WeakMap();
export function $context(el: HTMLElement, option: any) {
  if (!ctxMap.get(el)) {
    let vm = createVNode(ContextMenu, { option }); // 将组件渲染成虚拟节点
    ctxMap.set(el, vm);
    // 这里需要将el 渲染到我们的页面中
    render(vm, el);
  } else {
    
  }
}
