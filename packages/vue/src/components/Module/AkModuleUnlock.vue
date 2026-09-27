<script setup lang="ts">
/** 模组解锁表的一行（阶段条 · 解锁需求 · 材料消耗），放在 AkModule 的 #unlock 插槽里 */
defineProps<{
  /** 阶段 1–3：「STAGE n」+ 三段条点亮 n 段 */
  stage: 1 | 2 | 3;
}>();

defineSlots<{
  /** 材料消耗：一排 AkItem（AkItemList） */
  default?: () => unknown;
  /** 解锁需求：信赖 / 精英阶段与等级 / 任务标签，横排换行 */
  requirement?: () => unknown;
}>();
</script>

<template>
  <tr>
    <td class="lv">
      <span class="ak-module__lv">STAGE {{ stage }}<i aria-hidden="true"><b v-for="n in 3" :key="n" :class="{ on: n <= stage }" /></i></span>
    </td>
    <td><span class="ak-module__req"><slot name="requirement" /></span></td>
    <td><slot /></td>
  </tr>
</template>
