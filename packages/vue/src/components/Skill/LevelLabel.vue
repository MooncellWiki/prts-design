<script setup lang="ts">
/**
 * （内部）技能等级的写法，等级选择器 / 全等级表 / 参数矩阵共用：1–7 是数字，8–10 是专精 Ⅰ–Ⅲ。
 * 专精画游戏图标（specialized_tiny_N，由调用方给地址）；numeral 时图标后再跟罗马数字（表格里）；没给图标时写 M1–M3。
 */
defineProps<{
  /** 1–10（8–10 = 专精 Ⅰ–Ⅲ） */
  level: number;
  /** 专精 Ⅰ–Ⅲ 的图标地址 */
  icons?: readonly string[];
  /** 图标后跟罗马数字 */
  numeral?: boolean;
}>();

const NUMERALS = ["Ⅰ", "Ⅱ", "Ⅲ"];
</script>

<template>
  <template v-if="level <= 7">{{ level }}</template>
  <template v-else-if="icons?.[level - 8]">
    <img :src="icons[level - 8]" :alt="`专精${level - 7}`" /><span v-if="numeral" aria-hidden="true">{{ NUMERALS[level - 8] }}</span>
  </template>
  <template v-else><span aria-hidden="true">M{{ level - 7 }}</span><span class="ak-sr-only">专精{{ level - 7 }}</span></template>
</template>
