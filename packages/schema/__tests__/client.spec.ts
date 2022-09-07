import { describe, expect, it, test } from "vitest";
import { mount } from "@vue/test-utils";
import PropertyPane from "../src/client/components/PropertyPane.vue";
import inputComp from "./components/input.vue";
import errorComp from "./components/error.vue";

import { registerComp } from "../src/client";

let schema = {
  type: "object",
  properties: { a: { type: "string", component: "input" } },
};
let value = {
  a: "test a value",
};

test("client property pane", async () => {
  registerComp("input", inputComp);
  registerComp("error", errorComp);

  const wrapper = mount(PropertyPane, {
    props: {
      modelValue: value,
      schema: schema,
    },
  });
  expect(wrapper.find(`[test-id="show"]`).text()).toBe("test a value");
  expect(wrapper.find(`[test-id="/a"]`).exists()).toBe(false);
  await wrapper.find(`[test-id="btn"]`).trigger("click");
  expect(wrapper.find(`[test-id="/a"]`).text()).toBe("must be string");
});
