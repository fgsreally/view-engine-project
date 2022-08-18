<template>
  <ul>
    <li
      class="menu-second-block"
      v-for="(item, key) in list"
      :key="key"
      @mousedown="item.exec(key)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
interface listItem {
  label: string;
  exec: Function;
}
const { list } = defineProps<{ list: listItem[] }>();
</script>

<style scoped>
.menu-second-block {
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
}
</style>
