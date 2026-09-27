<script setup lang="ts">
/**
 * 模态对话框（同 Naive 的 NModal + NDialog）：原生 <dialog> + showModal()——焦点圈在对话框里、背后的页面 inert、Esc 关闭都由浏览器负责；
 * 这里补上：v-model 开合、点遮罩关闭、关闭后焦点还给打开前的元素、标题作可访问名。
 */
import { computed, onBeforeUnmount, onMounted, useId, useTemplateRef, watch } from "vue";

import AkButton from "../Button/AkButton.vue";

const props = withDefaults(
  defineProps<{
    /** 标题（同时作对话框的可访问名）；要带格式时用 #header 插槽 */
    title?: string;
    /** 可访问名：没有标题时写（aria-label） */
    label?: string;
    /** 宽度：sm 420 · md 640（默认）· lg 900 · full 占满 96vw × 92vh */
    size?: "sm" | "md" | "lg" | "full";
    /** 标题栏右侧的 ✕ 关闭按钮 */
    closable?: boolean;
    /** 点遮罩关闭（同 Naive 的 mask-closable） */
    maskClosable?: boolean;
    /** 按 Esc 关闭（同 Naive 的 close-on-esc） */
    closeOnEsc?: boolean;
    /** 确认按钮文字：写了就在底栏放一枚黑白反转的确认按钮，点了触发 positive-click 并关闭 */
    positiveText?: string;
    /** 取消按钮文字：写了就在底栏放一枚默认按钮，点了触发 negative-click 并关闭 */
    negativeText?: string;
  }>(),
  {
    title: undefined,
    label: undefined,
    size: "md",
    closable: true,
    maskClosable: true,
    closeOnEsc: true,
    positiveText: undefined,
    negativeText: undefined,
  },
);

/** 是否打开 */
const model = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  /** 点了确认按钮（之后关闭） */
  "positive-click": [];
  /** 点了取消按钮（之后关闭） */
  "negative-click": [];
}>();

defineSlots<{
  /** 正文 */
  default?: () => unknown;
  /** 标题（代替 title） */
  header?: () => unknown;
  /** 底栏按钮（代替 positive-text / negative-text 那两枚），右对齐 */
  footer?: () => unknown;
}>();

const id = useId();
const el = useTemplateRef<HTMLDialogElement>("el");
const classes = computed(() => ["ak-dialog", props.size !== "md" && `ak-dialog--${props.size}`]);

/** 打开前的焦点：关闭后还回去 */
let returnTo: HTMLElement | null = null;

function sync(open: boolean) {
  const d = el.value;
  if (!d) return;
  if (open && !d.open) {
    returnTo = d.ownerDocument.activeElement as HTMLElement | null;
    d.showModal();
  } else if (!open && d.open) d.close();
}
watch(model, sync, { flush: "post" });
onMounted(() => sync(model.value));
// 开着就被卸载（路由切走等）：不会有 close 事件，焦点也要还回去
onBeforeUnmount(() => {
  if (el.value?.open && returnTo?.isConnected) returnTo.focus();
});

/** 原生 close 事件：Esc、form[method=dialog]、d.close() 都走这里 */
function onClose() {
  model.value = false;
  if (returnTo?.isConnected) returnTo.focus();
  returnTo = null;
}

/** Esc 触发的 cancel：不许 Esc 关时拦下 */
function onCancel(e: Event) {
  if (!props.closeOnEsc) e.preventDefault();
}

/** 遮罩点击 = 点在 <dialog> 自身、且落在框外（::backdrop 的点击算在 dialog 上）；按下也要在框外，免得从框里拖选到框外被当成点遮罩 */
let downOutside = false;
const outside = (e: MouseEvent) => {
  const r = el.value!.getBoundingClientRect();
  return e.target === el.value && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
};
function onPointerdown(e: PointerEvent) {
  downOutside = outside(e);
}
function onClick(e: MouseEvent) {
  if (props.maskClosable && downOutside && outside(e)) model.value = false;
  downOutside = false;
}

function onPositive() {
  emit("positive-click");
  model.value = false;
}
function onNegative() {
  emit("negative-click");
  model.value = false;
}
</script>

<template>
  <dialog
    ref="el"
    :class="classes"
    :aria-labelledby="title || $slots.header ? `${id}-title` : undefined"
    :aria-label="label"
    @close="onClose"
    @cancel="onCancel"
    @pointerdown="onPointerdown"
    @click="onClick"
  >
    <div v-if="title || $slots.header || closable" class="ak-dialog__head">
      <h2 v-if="title || $slots.header" :id="`${id}-title`" class="ak-dialog__title"><slot name="header">{{ title }}</slot></h2>
      <span v-else class="ak-dialog__title" /><!-- 只有关闭按钮时占位，把它推到右边 -->
      <AkButton v-if="closable" icon="x" label="关闭" variant="ghost" size="sm" @click="model = false" />
    </div>
    <div class="ak-dialog__body"><slot /></div>
    <div v-if="$slots.footer || positiveText || negativeText" class="ak-dialog__foot">
      <slot name="footer">
        <AkButton v-if="negativeText" @click="onNegative">{{ negativeText }}</AkButton>
        <AkButton v-if="positiveText" variant="contrast" @click="onPositive">{{ positiveText }}</AkButton>
      </slot>
    </div>
  </dialog>
</template>
