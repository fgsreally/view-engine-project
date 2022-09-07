<template>
  <div :test-id="instancePath">{{ props?.message }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{ message?: string; instancePath?: string }>();
</script>
