<template>
  <div>
    <p test-id="show">{{ modelValue }}</p>
    <button @click="emits('update:modelValue', 1)" test-id="btn"></button>
  </div>
</template>

<script setup lang="ts">
const { modelValue } = defineProps<{ modelValue: any }>();
const emits = defineEmits(["update:modelValue"]);
</script>
