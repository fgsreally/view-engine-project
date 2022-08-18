<template>
  <el-row>
    <el-col :span="4">
      <section class="preview-section">
        <div
          v-for="(module, i) in comList"
          :key="i"
          @click="print(module[1])"
          @dragend="dragend"
          @dragstart="
            (e) => {
              dragstart(e, module);
            }
          "
        >
          <Preview :value="module[1]"></Preview>
        </div>
      </section>
    </el-col>
    <el-col :span="20">
      <div ref="container" class="editor-container">
        <Render :value="instance.data.blocks"></Render>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useMenuDragger, getModule } from "@fgsreally/view-engine";
import { ref } from "vue";
import { instance } from "../js/init";
import { registerModule } from "../js/register";
import Preview from "./Preview.vue";
import Render from "./Render.vue";
import { nanoid } from "nanoid";
function print(v) {
  console.log(v);
}
let comList = getModule<registerModule>();

console.log(comList);
let container = ref<HTMLElement | null>(null);
let { dragstart, dragend } = useMenuDragger(container as any, instance.data, {
  drop: ({ data, e, module }) => {
    print(e);
    data.blocks.push({
      parent: "1",
      blocks: [],
      uuid: nanoid(),
      propsData: {},
      key: module[0],
      x: e.offsetX,
      y: e.offsetY,
    });
    print(data);
  },
});
</script>

<style>
.preview-section {
  height: 100vh;
  width: 100%;
  border: 1px solid red;
}
.editor-container {
  width: 100%;
  position: relative;
  height: 100vh;
  border: 1px solid yellow;
}
</style>
