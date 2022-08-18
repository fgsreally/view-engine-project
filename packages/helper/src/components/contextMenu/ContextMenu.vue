<template>
  <section
    class="menu-container"
    :style="{ left: x + 'px', top: y + 'px' }"
    v-out="change"
  >
    <div>
      <div class="menu-first-block" v-for="(item, i) in list" :key="i">
        <button>{{ item.label }}</button>
        <SecondList v-if="item.child" :list="item.child" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.menu-first-block {
  color: rgba(17, 24, 39, 1);
  display: flex;
  border-radius: 0.375rem;
  width: 100%;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
}
.menu-second {
  display: none;
}
.menu-first-block:hover > .menu-second {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 100%;
  width: 100%;
  border-radius: 0.375rem;

  background-color: white;
}
.menu-container {
  position: absolute;
  z-index: 50;
  right: 0;
  margin-top: 2rem;
  width: 10rem;
  transform-origin: top right;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: rgba(243, 244, 246, 1);
  border-radius: 0.375rem;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translate(v-bind(offsetX), v-bind(offsetY));
}
</style>

<script setup lang="ts">
import { ref } from "vue";

interface listItem {
  label: string;
  exec: Function;
  child?: listItem[];
}

const isShow = ref(false);
const { x, y, list, mode } = defineProps<{
  x: number;
  y: number;
  list: listItem[];
  mode: "lt" | "lb" | "rt" | "rb";
}>();

let offsetX = mode.includes("l") ? "-10rem" : "0";
let offsetY = mode.includes("b") ? `-${list.length * 1.25}rem` : "0";

function change() {
  isShow.value = !isShow.value;
}

defineExpose({ change });
</script>
