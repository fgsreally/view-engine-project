import { App } from "vue";

export default (app: App) => {
  let invoke: (e: MouseEvent) => void;

  app.directive("out", {
    mounted: (el, binding) => {
      invoke = (e: MouseEvent) => {
        if (!el.contains(e.target)) {
          binding.value(e);
        }
      };

      let event = binding.arg || "click";
      window.addEventListener(event, invoke as any);
    },
    unmounted: (el, binding) => {
      let event = binding.arg || "click";

      window.removeEventListener(event, invoke as any);
    },
  });
};
