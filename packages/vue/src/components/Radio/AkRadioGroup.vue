<script setup lang="ts">
import { Comment, Fragment, cloneVNode, h, mergeProps, provide, useAttrs, useId, type VNode } from "vue";

import { useField } from "../Field/context";
import AkRadioButton from "./AkRadioButton.vue";
import { radioGroupKey, type RadioSize, type RadioValue } from "./context";

/**
 * 一组单选（同 Naive 的 NRadioGroup）：v-model 是选中项的 value。role="radiogroup"，组名来自 AkField 的标签或 label。
 * 里面放 AkRadio → 一排原生单选（.ak-check-group，同名互斥、方向键是浏览器自己的）；
 * 放 AkRadioButton → 分段控件（.ak-btn-group 里的 .ak-btn，选中 .is-active），roving tabindex 与方向键由这里处理。
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 原生 name（普通单选靠它互斥）；不写自动生成 */
    name?: string;
    /** 整组禁用 */
    disabled?: boolean;
    /** 尺寸：单选按钮 sm 30 · md 36 · lg 44（px 高）；普通单选只有 sm（16px 圆）与 md */
    size?: RadioSize;
    /** 竖排（只对普通单选；单选按钮总是连成一排） */
    vertical?: boolean;
    /** 读屏用的组名（aria-label）；放在带标签的 AkField 里时不用写 */
    label?: string;
  }>(),
  { name: undefined, size: undefined, label: undefined },
);

/** 选中项的 value */
const model = defineModel<RadioValue>();

const slots = defineSlots<{
  /** 若干 AkRadio，或若干 AkRadioButton */
  default?: () => VNode[];
}>();

const field = useField("group");
const attrs = useAttrs();
const autoName = useId();

provide(radioGroupKey, {
  get value() {
    return model.value;
  },
  get name() {
    return props.name ?? autoName;
  },
  get disabled() {
    return props.disabled;
  },
  get size() {
    return props.size;
  },
  select(value) {
    model.value = value;
  },
});

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(n => (n.type === Fragment && Array.isArray(n.children) ? flatten(n.children as VNode[]) : n.type === Comment ? [] : [n]));
/** <AkRadioButton disabled> 在 vnode.props 里是 "" */
const isOn = (v: unknown) => v !== undefined && v !== false;

/** 单选按钮：←/↑ 上一个、→/↓ 下一个（跳过禁用、首尾循环），移过去即选中（WAI-ARIA Radio Group） */
function onKey(e: KeyboardEvent) {
  const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
  if (!step) return;
  const radios = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>(':scope > [role="radio"]')];
  const from = radios.indexOf((e.target as HTMLElement).closest<HTMLButtonElement>('[role="radio"]')!);
  if (from < 0) return;
  e.preventDefault();
  for (let i = 1; i < radios.length; i++) {
    const to = radios[(((from + step * i) % radios.length) + radios.length) % radios.length];
    if (!to.disabled) return void (to.focus(), to.click());
  }
}

/**
 * 同 Naive 的 NRadioGroup：从默认插槽里看子项是不是单选按钮，决定整组的结构；单选按钮再补上 roving tabindex
 * （选中项 0、其余 -1；没有选中项时第一个可用的是 0）。插槽只能在渲染期调用，所以整个根节点在这里画。
 */
const Root = () => {
  const nodes = flatten(slots.default?.() ?? []);
  const common = mergeProps(attrs, field.attrs.value, {
    role: "radiogroup",
    "aria-label": props.label,
    "aria-required": field.required.value || undefined,
  });
  const buttons = nodes.filter(n => n.type === AkRadioButton);
  if (!buttons.length) return h("div", mergeProps(common, { class: ["ak-check-group", props.vertical && "ak-check-group--vertical"] }), nodes);

  const enabled = buttons.filter(n => !props.disabled && !isOn(n.props?.disabled)).map(n => n.props?.value as RadioValue);
  const stop = enabled.includes(model.value!) ? model.value : enabled[0];
  return h(
    "div",
    // data-no-toggle：皮肤脚本会替模板输出的 .ak-btn-group 翻 is-active，这里的选中只看 v-model
    mergeProps(common, { class: "ak-btn-group", "data-no-toggle": "", onKeydown: onKey }),
    nodes.map(n => (n.type === AkRadioButton ? cloneVNode(n, { tabindex: n.props?.value === stop ? 0 : -1 }) : n)),
  );
};
</script>

<template>
  <Root />
</template>
