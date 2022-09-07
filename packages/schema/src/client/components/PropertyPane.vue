<template>
  <Message :path="''"></Message>
  <Container> </Container>
  <Draggable v-for="(item, i) in (schema.properties as Object)" :key="i">
    <BaseRenderer :path="i" :schema="item"></BaseRenderer
  ></Draggable>
</template>

<script setup lang="ts">
import { Container, Draggable } from "vue3-smooth-dnd";

import Message from "./Message.vue";
import {
  allCompList,
  registerExec,
  addDefaultFormat,
  addSchema,
  invokeExec,
} from "../core";
import BaseRenderer from "./BaseRenderer.vue";
import { provide, watch } from "vue";
const {
  modelValue: value,
  schema,
  isWatch,
  key,
} = withDefaults(
  defineProps<{
    modelValue: any;
    schema: any;
    isWatch?: boolean;
    key?: string;
  }>(),
  { isWatch: true, key: "default" }
);

provide("pr-data", value);
provide("pr-register", registerExec);
provide("pr-component-list", allCompList);

addDefaultFormat("component");
let errStack: string[] = [];
let validate = addSchema(key, schema);

provide("pr-validate", () => {
  validateData(value);
});

function validateData(value: any) {
  let valid = validate(value);
  errStack.forEach((item) => invokeExec(item, "switchMsg", ""));
  if (!valid) {
    errStack = [];
    validate.errors?.forEach((item) => {
      let p = item.instancePath.replace("/", ".").substring(1);
      errStack.push(p);
      invokeExec(p, "switchMsg", item);
    });
  }
}
if (isWatch) {
  watch(value, (n: any) => {
    validateData(n);
  });
}
</script>
