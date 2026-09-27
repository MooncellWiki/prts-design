<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 图标地址：elite/elite_N.png（白线稿，亮色主题下 CSS 反相为黑）；lg 用 elite_N_large.png */
    src: string;
    /** 精英阶段 0–2：给出默认文字「精英零 / 一 / 二」 */
    phase?: 0 | 1 | 2;
    /** 等级：接在阶段名后面，「精英二 Lv60」 */
    level?: number;
    /** 文字：默认由 phase + level 拼出，可改写（「提升至精英阶段 1 等级 1」「专精 Ⅰ」）；false 只显示图标 */
    text?: string | false;
    /** 尺寸：md 图标 16px 高（默认，配文字）· lg 28px 高（一般只放图标） */
    size?: "md" | "lg";
    /** 可访问名：只显示图标时作图标的 alt，默认是阶段名；有文字时图标是装饰 */
    label?: string;
  }>(),
  { phase: undefined, level: undefined, text: undefined, size: "md", label: undefined },
);

defineSlots<{
  /** 文字（代替 text），可以带链接 / 加粗 */
  default?: () => unknown;
}>();

const CN = ["零", "一", "二"];
const phaseName = computed(() => (props.phase === undefined ? undefined : `精英${CN[props.phase]}`));
const content = computed(() => {
  if (props.text !== undefined) return props.text || undefined;
  if (!phaseName.value) return undefined;
  return props.level === undefined ? phaseName.value : `${phaseName.value} Lv${props.level}`;
});
</script>

<template>
  <span :class="['ak-elite', size === 'lg' && 'ak-elite--lg']">
    <img :src="src" :alt="$slots.default || content ? '' : (label ?? phaseName ?? '')" />
    <slot>{{ content }}</slot>
  </span>
</template>
