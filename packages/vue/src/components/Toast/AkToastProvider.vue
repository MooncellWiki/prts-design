<script setup lang="ts">
/**
 * 轻提示的容器（同 Naive 的 NMessageProvider）：包在应用 / 小部件的最外层，里面的组件用 useToast() 弹提示。
 * 提示栈 .ak-toasts 固定在视口右下角，是一个 aria-live="polite" 的区域：新弹出的提示读屏会念，不打断当前朗读。
 * 也可以拿组件 ref 直接调（ref 上有和 useToast() 一样的方法）。
 */
import { onBeforeUnmount, provide, reactive } from "vue";

import { Render } from "../Tooltip/trigger";
import { toastKey, type ToastApi, type ToastContent, type ToastOptions, type ToastVariant } from "./useToast";

const props = withDefaults(
  defineProps<{
    /** 默认停留时长（ms），0 = 不自动消失；单条可以在选项里改 */
    duration?: number;
    /** 默认显示 ✕ 关闭按钮 */
    closable?: boolean;
    /** 鼠标悬停 / 键盘聚焦在某条上时暂停它的倒计时（同 Naive 的 keep-alive-on-hover） */
    keepAliveOnHover?: boolean;
    /** 最多同时显示几条，多了先关最早的 */
    max?: number;
    /** 把提示栈传送到别处（Teleport 的 to，如 "body"）；不写就渲染在原地——它是 fixed 定位，一般用不着 */
    to?: string | HTMLElement;
    /** 读屏里提示栈的名字 */
    label?: string;
  }>(),
  { duration: 5000, closable: true, keepAliveOnHover: true, max: undefined, to: undefined, label: "通知" },
);

defineSlots<{
  /** 应用内容：里面的组件可以 useToast() */
  default?: () => unknown;
}>();

interface Item {
  key: number;
  variant: ToastVariant;
  content: ToastContent;
  title?: string;
  duration: number;
  closable: boolean;
  onClose?: () => void;
  hovered: boolean;
  focused: boolean;
  /** 剩余时长（暂停时扣掉已走的）与本轮开始计时的时刻 */
  remaining: number;
  started: number;
  timer?: ReturnType<typeof setTimeout>;
}

const list = reactive<Item[]>([]);
let seq = 0;

function destroy(key: number) {
  const i = list.findIndex(t => t.key === key);
  if (i < 0) return;
  const [t] = list.splice(i, 1);
  clearTimeout(t.timer);
  t.onClose?.();
}

function run(t: Item) {
  clearTimeout(t.timer);
  if (t.duration <= 0) return;
  t.started = Date.now();
  t.timer = setTimeout(() => destroy(t.key), t.remaining);
}

const held = (t: Item) => props.keepAliveOnHover && t.duration > 0 && (t.hovered || t.focused);

/** 悬停 / 聚焦：暂停倒计时（进度条由 .is-paused 停住），都离开后接着走剩下的 */
function hold(t: Item, kind: "hovered" | "focused", on: boolean) {
  const was = held(t);
  t[kind] = on;
  const now = held(t);
  if (!was && now) {
    clearTimeout(t.timer);
    t.remaining -= Date.now() - t.started;
  } else if (was && !now) run(t);
}

function onFocusout(e: FocusEvent, t: Item) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) hold(t, "focused", false);
}

function create(content: ToastContent, options: ToastOptions & { variant?: ToastVariant } = {}) {
  const duration = options.duration ?? props.duration;
  list.push({
    key: ++seq,
    variant: options.variant ?? "info",
    content,
    title: options.title,
    duration,
    closable: options.closable ?? props.closable,
    onClose: options.onClose,
    hovered: false,
    focused: false,
    remaining: duration,
    started: 0,
  });
  const t = list[list.length - 1];
  if (props.max && list.length > props.max) destroy(list[0].key);
  run(t);
  return { destroy: () => destroy(t.key) };
}

const api: ToastApi = {
  create,
  info: (c, o) => create(c, { ...o, variant: "info" }),
  success: (c, o) => create(c, { ...o, variant: "success" }),
  warning: (c, o) => create(c, { ...o, variant: "warning" }),
  error: (c, o) => create(c, { ...o, variant: "danger" }),
  destroyAll: () => [...list].forEach(t => destroy(t.key)),
};
provide(toastKey, api);
defineExpose(api);

onBeforeUnmount(() => list.forEach(t => clearTimeout(t.timer)));
</script>

<template>
  <slot />
  <Teleport :to="to" :disabled="!to">
    <div class="ak-toasts" role="region" :aria-label="label" aria-live="polite" aria-relevant="additions">
      <div
        v-for="t in list"
        :key="t.key"
        :class="['ak-toast', t.variant !== 'info' && `ak-toast--${t.variant}`, { 'is-paused': held(t) }]"
        :style="t.duration > 0 ? { '--_dur': `${t.duration}ms` } : undefined"
        @mouseenter="hold(t, 'hovered', true)"
        @mouseleave="hold(t, 'hovered', false)"
        @focusin="hold(t, 'focused', true)"
        @focusout="onFocusout($event, t)"
      >
        <div class="ak-toast__body">
          <div v-if="t.title" class="ak-toast__title">{{ t.title }}</div>
          <div><Render :content="t.content" /></div>
        </div>
        <button v-if="t.closable" type="button" class="ak-message__close" aria-label="关闭" @click="destroy(t.key)">✕</button>
        <i v-if="t.duration > 0" class="ak-toast__progress" aria-hidden="true" />
      </div>
    </div>
  </Teleport>
</template>
