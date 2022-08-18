<template>
  <section class="stretch-container">
    <div class="stretch-box"><slot name="first"></slot></div>
    <div class="stretch-dragger"></div>
    <div class="stretch-box"><slot name="second"></slot></div>
  </section>
</template>

<script setup lang="ts">
import { stretch, stretchType } from "../../utils/hook/stretch";
import { onMounted, ref } from "vue";
const {
  width,
  height,
  initWidth,
  gap = "0",
  type,
} = defineProps<{
  initWidth: string;
  width: string;
  height: string;
  gap: string;
  type: stretchType;
}>();
const container = ref<HTMLElement | null>(null);
const dragEl = ref<HTMLElement | null>(null);

onMounted(() => {
  stretch(container.value as HTMLElement, dragEl.value as HTMLElement, type);
});
</script>
<style lang="scss">
.stretch-container {
  display: grid;
  grid-template-columns: v-bind(initWidth) 10px auto;
  grid-gap: v-bind(gap);
  width: v-bind(width);
  height: v-bind(height);
}
.stretch-box {
  position: relative;
  width: 100%;
  height: 100%;
}
.stretch-dragger {
  width: 10px;
  height: 100%;
  cursor: move;
}
</style>
