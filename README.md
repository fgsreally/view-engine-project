## v-lowcode-engine

包括 工具、渲染、容器操作、注册、数据管理这四部分，可以按需使用

## container

一些对画布容器的操作方法

```js
useCommand; //basic command,like redo/undo
useDragger; //basic drag operation
useEventListener; //basic event listener
useFocus; //basic select-block operation
```

## renderer

```js

let renderer=new Renderer(...)
  const RealBlock = defineComponent({
      render: () => renderer.main().vIf().exec(),
    });
```

本质上是将 block 数据通过链式操作转为 vnode，从而对组件做映射或者包裹
可以继承 Renderer 类，去封装更多的方法

## register

```ts
let RegisterCenter = createEditorConfig<registerModule>();
  RegisterCenter.register({...})
```

即 block 数据的映射，可以包括标签，渲染方法，注释等等

## engine/data-mananger

```ts
let instance = new Engine({ container: {}, blocks: [], testKey: "UUID" });
```
即block的控制器，创建/销毁/更改/查找均依赖于此，
同时也是单例数据的管理者，比如操作中的数据（例如此时被点击的节点）和激活的容器状态，通过这个来进行操作


## utils

主要封装一些操作行为/样式处理/数据存储/数据转化
