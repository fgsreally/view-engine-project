<template>
  <div class="drag-box">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.drag-control {
  width: 10px;
  height: 10px;
  background-color: blue;
  position: absolute;
}
</style>
