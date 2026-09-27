<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { useField, useSplitAttrs } from "../Field/context";

/**
 * 数字输入（同 Naive 的 NInputNumber）：.ak-number 里 − / 输入 / + 三段，按钮常显。
 * 输入框是 role="spinbutton"：↑↓ 一步、PageUp / PageDown 十步、Home / End 到上下限；两个按钮不进 Tab 顺序（键盘用方向键）。
 * class / style 给外层，其余属性给 <input>。
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 最小值 */
    min?: number;
    /** 最大值 */
    max?: number;
    /** 步长：按钮 / 方向键每次加减多少 */
    step?: number;
    /** 禁用 */
    disabled?: boolean;
    /** 只读：值能看能复制，不能改 */
    readonly?: boolean;
    /** 清空时的占位提示 */
    placeholder?: string;
    /** 显示 − / + 按钮（同 Naive 的 show-button） */
    showButton?: boolean;
    /** 可访问名（aria-label）：不在 AkField 里、旁边也没有 <label> 时必填 */
    label?: string;
  }>(),
  { min: undefined, max: undefined, step: 1, placeholder: undefined, showButton: true, label: undefined },
);

/** 当前值；输入框清空后是 null */
const model = defineModel<number | null>();

const field = useField();
const attrs = useSplitAttrs();

const format = (v: number | null | undefined) => (v === null || v === undefined ? "" : String(v));
/** 输入框里的文字：打字时可以暂时是「12.」「-」这类还不是数字的样子，失焦 / 回车时再落到 model */
const text = ref(format(model.value));
watch(model, v => {
  if (parse(text.value) !== v) text.value = format(v);
});

/** 文字 → 数字；空 = null，不合法 = undefined */
function parse(s: string): number | null | undefined {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}
const clamp = (n: number) => Math.min(props.max ?? Infinity, Math.max(props.min ?? -Infinity, n));
/** 加减步长时按步长与当前值的小数位取整，避免 0.1 + 0.2 这类尾巴 */
const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;

function set(n: number | null) {
  model.value = n;
  text.value = format(n);
}
/** 打字时：是合法数字且在范围内就实时更新（同 Naive 的 update-value-on-input），否则等失焦 */
function onInput(e: Event) {
  text.value = (e.target as HTMLInputElement).value;
  const n = parse(text.value);
  if (typeof n === "number" && n === clamp(n)) model.value = n;
}
/** 失焦 / 回车：落到范围内；不合法就退回原值 */
function commit() {
  const n = parse(text.value);
  if (n === undefined) text.value = format(model.value);
  else set(n === null ? null : clamp(n));
}
function add(steps: number) {
  if (props.disabled || props.readonly) return;
  const base = model.value ?? props.min ?? 0;
  const next = base + steps * props.step;
  set(clamp(Number(next.toFixed(Math.max(decimals(props.step), decimals(base))))));
}

const atMin = computed(() => props.min !== undefined && model.value !== null && model.value !== undefined && model.value <= props.min);
const atMax = computed(() => props.max !== undefined && model.value !== null && model.value !== undefined && model.value >= props.max);
const locked = computed(() => props.disabled || props.readonly);

/** Home / End 只在有上下限时接管（否则留给光标移动） */
function onKey(e: KeyboardEvent) {
  const { min, max } = props;
  const act: Record<string, (() => void) | undefined> = {
    ArrowUp: () => add(1),
    ArrowDown: () => add(-1),
    PageUp: () => add(10),
    PageDown: () => add(-10),
    Home: min === undefined ? undefined : () => locked.value || set(min),
    End: max === undefined ? undefined : () => locked.value || set(max),
    Enter: commit,
  };
  const fn = act[e.key];
  if (!fn) return;
  e.preventDefault();
  fn();
}

/** 整数、不会是负数时给手机弹数字键盘；否则要能输小数点 / 负号 */
const inputmode = computed(() => (Number.isInteger(props.step) && (props.min ?? -1) >= 0 ? "numeric" : "decimal"));
</script>

<template>
  <div v-bind="attrs.root.value" class="ak-number">
    <button v-if="showButton" type="button" tabindex="-1" aria-label="减少" :disabled="locked || atMin" @click="add(-1)">−</button>
    <input
      type="text"
      role="spinbutton"
      autocomplete="off"
      :inputmode="inputmode"
      v-bind="{ ...field.attrs.value, ...attrs.control.value }"
      :value="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="field.required.value || undefined"
      :aria-invalid="field.status.value === 'error' || undefined"
      :aria-label="label"
      :aria-valuenow="model ?? undefined"
      :aria-valuemin="min"
      :aria-valuemax="max"
      @input="onInput"
      @blur="commit"
      @keydown="onKey"
    />
    <button v-if="showButton" type="button" tabindex="-1" aria-label="增加" :disabled="locked || atMax" @click="add(1)">+</button>
  </div>
</template>
