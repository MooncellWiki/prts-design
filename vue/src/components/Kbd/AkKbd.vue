<script setup lang="ts">
/** 键帽（<kbd class="ak-kbd">）：快捷键提示——面板页脚、触发器右侧、行内说明。组合键写成几枚键帽，中间的「+」写在外面 */
defineSlots<{
  /** 键名：Ctrl、K、Esc、↵、/ … */
  default?: () => unknown;
}>();
</script>

<template>
  <kbd class="ak-kbd"><slot /></kbd>
</template>
