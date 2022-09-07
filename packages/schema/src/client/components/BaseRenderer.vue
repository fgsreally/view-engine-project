<template>
  <div>
    <component
      :is="renderComp"
      :modelValue="get(data, path)"
      @update:modelValue="(v:any) => set(data, path, v)"
    ></component>
  </div>
  <Message :path="path"></Message>
</template>

<script lang="ts" setup>
import { get, set } from "lodash";
import { inject, ref, computed, Component } from "vue";
import { getRule } from "../core";
import Message from "./Message.vue";
const { schema, path } = defineProps<{
  schema: any;
  path: string;
}>();

const data = inject("pr-data") as any;
const allCompList = inject("pr-component-list") as {
  [key in string]: Component;
};
// if (!schema.defaultComp) throw new Error(`没有给予defaultComp值`);
// const curComp = ref(schema.defaultComp);
const renderComp = computed(() => {
  let compName = schema.component || getRule()(schema);
  let comp = allCompList[compName] as Component | (() => Promise<Component>);
  if (!comp) {
    throw new Error(`不存在名为${compName}的组件`);
  }
  return comp;
});
</script>
