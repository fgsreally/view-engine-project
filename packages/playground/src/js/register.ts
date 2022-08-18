import { createEditorConfig, defaultRegisterModule } from "@fgsreally/view-engine";
import { Component, h } from "vue";

export interface registerModule extends defaultRegisterModule {
  propsData: any;
}

let RegisterCenter = createEditorConfig<registerModule>();

export function registerComponent(
  Comp: Component,
  label: string,
  key: string,
  type: string,
  propsData = {}
) {
  RegisterCenter.register({
    comp: Comp,
    key: key,
    label: label,
    type: type,
    preview: () => {
      return h(Comp);
    },
    render: (Block: any) => {
      return h(Comp as any, {
        style: {
          position: "absolute",
          left: Block.x + "px",
          top: Block.y + "px",
        },
      });
    },
    propsData: propsData,
  });
}
