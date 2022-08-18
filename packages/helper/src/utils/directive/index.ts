import { App } from "vue";

export default (app: App) => {
  app.directive("tip", {
    mounted(el, binding) {
      let { innerWidth, innerHeight } = window;
      let { x, y, width, height } = el.getBoundingClientRect();

      if (binding.arg === "v") {
        if (x + width / 2 > innerWidth / 2) {
          el.classList.add("f-tip-left");
        } else {
          el.classList.add("f-tip-right");
        }
      }
      if (binding.arg === "h") {
        if (y + height / 2 > innerHeight / 2) {
          el.classList.add("f-tip-top");
        } else {
          el.classList.add("f-tip-bottom");
        }
      }
    },
  });
};
