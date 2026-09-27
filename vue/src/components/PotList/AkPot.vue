<script setup lang="ts">
import { computed, inject } from "vue";

import AkPotential from "../Potential/AkPotential.vue";
import { potListKey } from "./context";

/** 潜能提升一览里的一格：图标 + 小标「潜能 N」+ 效果（默认插槽），只能放在 AkPotList 里 */
const props = withDefaults(
  defineProps<{
    /** 潜能等级 2–6：给出小标「潜能 N」，并与 AkPotList 的 value 比较决定是否点亮 */
    level: 2 | 3 | 4 | 5 | 6;
    /** 潜能图标地址（potential/potential_{N−1}.png） */
    src: string;
    /** 小标：默认「潜能 N」 */
    title?: string;
    /** 点亮（已生效）：不写时按 AkPotList 的 value 算 */
    active?: boolean;
  }>(),
  { title: undefined, active: undefined },
);

defineSlots<{
  /** 效果：「部署费用<span class="ak-rt-vup">-1</span>」这种，可带富文本 */
  default?: () => unknown;
}>();

const list = inject(potListKey, null);
const on = computed(() => props.active ?? (list?.value !== undefined && props.level <= list.value));
</script>

<template>
  <div :class="['ak-pot', { 'is-on': on }]" role="listitem" :data-pot="level">
    <AkPotential :src="src" label="" />
    <div>
      <span class="ak-pot__label">{{ title ?? `潜能 ${level}` }}</span>
      <slot />
      <span v-if="on" class="ak-sr-only">（已生效）</span>
    </div>
  </div>
</template>
