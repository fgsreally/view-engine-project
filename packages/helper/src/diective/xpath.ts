import { App } from "vue";
export let xPath = {
  install: (app: App) => {
    app.directive("xClass", (el, binding) => {
      for (let i in binding.value) {
        try {
          let dom = document.evaluate(
            i,
            el,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue as HTMLElement;
          if (typeof binding.value[i].include === "string") {
            binding.value[i].include.split(" ").forEach((item: string) => {
              if (!item) return;
              dom.classList.add(item);
            });
          } else {
            if (Array.isArray(binding.value.include[i])) {
              binding.value.include[i].forEach((item: string) => {
                dom.classList.add(item);
              });
            }
          }
        } catch (e) {
          console.error(e, "xpath路径可能有误或该节点不支持xpath");
        }
      }
    });
    app.directive("xExec", (el, binding) => {
      for (let i in binding.value) {
        try {
          let dom = document.evaluate(
            i,
            el,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue as HTMLElement;

          if (typeof binding.value[i] === "function") {
            binding.value[i](dom, binding.instance);
          }
        } catch (e) {
          console.error(e, "xpath路径可能有误或该节点不支持xpath");
        }
      }
    });
  },
};
