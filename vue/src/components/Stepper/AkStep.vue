<script setup lang="ts">
/**
 * 步骤条的一步（= Naive 的 NStep），只能直接放在 AkSteps 里。
 * AkSteps 读它的 title / status / 默认插槽自己画这一步（序号由 CSS 计数器给），这个组件本身不会被挂载。
 */
export type StepStatus = "wait" | "active" | "done";

defineProps<{
  /** 步骤名（也可以写在默认插槽里） */
  title?: string;
  /** 状态：wait 未到 · active 当前（主色序号 + 加粗）· done 已完成（主色序号 + 主色连线）；不写时按 AkSteps 的 current 推算 */
  status?: StepStatus;
}>();

defineSlots<{
  /** 步骤名（代替 title） */
  default?: () => unknown;
}>();
</script>

<template>
  <slot>{{ title }}</slot>
</template>
