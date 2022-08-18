<template>
  <Teleport :to="to" :disabled="isFull"></Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { to } = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const isFull = ref(false);

window.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement !== null) {
    isFull.value = true;
  } else {
    isFull.value = false;
  }
});

function turnFull() {
  isFull.value = true;
}

defineExpose({ turnFull });
</script>
