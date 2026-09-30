<script setup lang="ts">
import { computed, nextTick } from "vue";

/**
 * 精英阶段选择器（E0 / E1 / E2）：属性计算器 / 攻击范围这类「同一块数据按阶段重算」的地方用。
 * 语义是单选组（WAI-ARIA Radio Group）而不是页签：它不切换面板，只改一个值，下游数据跟着重算。
 */
const props = withDefaults(
  defineProps<{
    /** 最高精英阶段：只画到这一阶（三星干员 1，一 / 二星 0） */
    max?: 0 | 1 | 2;
    /** 各阶段图标地址，下标 = 阶段（elite/elite_N.png，白线稿；选中项在反色块上自动反相）；不传只有文字 */
    icons?: string[];
    /** 读屏用的组名 */
    label?: string;
  }>(),
  { max: 2, icons: () => [], label: "精英阶段" },
);

/** 当前精英阶段 0–2 */
const model = defineModel<number>({ default: 0 });

const phases = computed(() => Array.from({ length: props.max + 1 }, (_, i) => i));
/** 绑定的值超出 max（换了个星级低的干员）时按最高阶显示，保证总有一项在 Tab 顺序里 */
const current = computed(() => Math.min(Math.max(model.value, 0), props.max));

/** 方向键在阶段间移动并选中，首尾循环（WAI-ARIA Radio Group）；Space / Enter 由 <button> 自己触发 click */
function onKey(e: KeyboardEvent) {
  const n = phases.value.length;
  const i = current.value;
  const to =
    e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n
    : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n
    : undefined;
  if (to === undefined) return;
  e.preventDefault();
  model.value = to;
  const group = e.currentTarget as HTMLElement;
  nextTick(() => group.querySelectorAll<HTMLElement>("[role=radio]")[to]?.focus());
}
</script>

<template>
  <!-- data-no-toggle：皮肤脚本会替模板输出的 .ak-phase-tabs 翻 is-active 并发 akds:select，这里的选中只看 v-model -->
  <div class="ak-phase-tabs" role="radiogroup" :aria-label="label" data-no-toggle @keydown="onKey">
    <button
      v-for="p in phases"
      :key="p"
      type="button"
      role="radio"
      :class="{ 'is-active': p === current }"
      :aria-checked="p === current"
      :tabindex="p === current ? 0 : -1"
      @click="model = p"
    >
      <img v-if="icons[p]" :src="icons[p]" alt="" />E{{ p }}
    </button>
  </div>
</template>
