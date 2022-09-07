<template>
  <component
    :is="allCompList.error"
    v-show="isShowMsg"
    v-bind="MsgValue"
  ></component>
</template>
<script lang="ts" setup>
import { inject, ref, Component } from "vue";

const { path } = defineProps<{ path: string }>();
const allCompList = inject("pr-component-list") as {
  [key in string]: Component;
};
const register = inject("pr-register") as (
  path: string,
  key: string,
  params: any
) => void;

const isShowMsg = ref(false);
const MsgValue = ref({});
function switchMsg(value: any) {
  isShowMsg.value = !isShowMsg.value;
  MsgValue.value = value;
  console.log(value);
}
register(path, "switchMsg", switchMsg);
</script>
