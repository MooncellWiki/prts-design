<script setup lang="ts">
import { computed, nextTick } from "vue";

import LevelLabel from "../Skill/LevelLabel.vue";

const props = withDefaults(
  defineProps<{
    /** 最高等级：7 = 只有 1–7（三星及以下 / 未精二），10 = 再加专精 Ⅰ–Ⅲ */
    max?: number;
    /** 专精 Ⅰ–Ⅲ 的图标地址（游戏 specialized_tiny_1–3）；不给时写 M1–M3 */
    masteryIcons?: readonly string[];
    /** 读屏用的组名 */
    label?: string;
    /** 整组禁用 */
    disabled?: boolean;
  }>(),
  { max: 10, masteryIcons: undefined, label: "技能等级" },
);

/** 当前等级 1–10（8–10 = 专精 Ⅰ–Ⅲ）；不绑定时没有选中项 */
const model = defineModel<number>();

const levels = computed(() => Array.from({ length: props.max }, (_, i) => i + 1));
/** roving tabindex：Tab 只停在选中项上（没选中时停在第一项） */
const tabStop = computed(() => (model.value && model.value <= props.max ? model.value : 1));

/** 类名；普通等级未选中时不输出 class 属性（同 CSS 实现里的 <button>1</button>） */
const btnClass = (lv: number) => [lv === model.value && "is-active", lv > 7 && "is-mastery"].filter(Boolean).join(" ") || undefined;

/** 方向键 / Home / End 移到上一级 / 下一级并选中（WAI-ARIA Radio Group） */
function onKey(e: KeyboardEvent) {
  const n = props.max;
  const i = tabStop.value;
  const to =
    e.key === "ArrowRight" || e.key === "ArrowDown" ? (i % n) + 1
    : e.key === "ArrowLeft" || e.key === "ArrowUp" ? ((i - 2 + n) % n) + 1
    : e.key === "Home" ? 1
    : e.key === "End" ? n
    : undefined;
  if (!to) return;
  e.preventDefault();
  model.value = to;
  const group = e.currentTarget as HTMLElement;
  nextTick(() => (group.children[to - 1] as HTMLElement | undefined)?.focus());
}
</script>

<template>
  <div class="ak-skill-levels" role="radiogroup" :aria-label="label" :aria-disabled="disabled || undefined" @keydown="onKey">
    <button
      v-for="lv in levels"
      :key="lv"
      type="button"
      role="radio"
      :class="btnClass(lv)"
      :aria-checked="lv === model"
      :tabindex="lv === tabStop ? 0 : -1"
      :disabled="disabled"
      @click="model = lv"
    >
      <LevelLabel :level="lv" :icons="masteryIcons" />
    </button>
  </div>
</template>
