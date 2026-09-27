<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";

import type { IconName } from "../../icons";
import AkIcon from "../Icon/AkIcon.vue";

/**
 * 回到顶部（= Naive 的 NBackTop；CSS 叫 FAB / .ak-fab）：右下角 44px 反色方块，滚过 visibility-height 淡入，点了平滑滚回顶部。
 * 整页那枚由皮肤输出（skin.js 同样 600px 出现），而且 < 1400 时皮肤把它收进目录浮层——Vue 版主要给「页面里某个滚动区域」用：
 * position="absolute" + listen-to 指向那个容器。隐藏时 inert：不可点、不进 Tab 顺序、读屏读不到。
 */
const props = withDefaults(
  defineProps<{
    /** 可访问名（aria-label，同时作 title） */
    label?: string;
    /** 图标 */
    icon?: IconName;
    /** 滚动超过多少 px 出现（同 Naive 的 visibility-height）；false = 不看滚动，显隐完全由 v-model 定 */
    visibilityHeight?: number | false;
    /** 监听、并滚回顶部的滚动容器（元素或选择器）；不写 = 整页。模板 ref 还没就绪（null）时先不监听 */
    listenTo?: HTMLElement | string | null;
    /** 定位：fixed 贴视口右下（默认，整页一枚）· absolute 贴最近的定位祖先右下（配合 listen-to 给页面里的滚动区域） */
    position?: "fixed" | "absolute";
  }>(),
  { label: "回到顶部", icon: "up", visibilityHeight: 600, listenTo: undefined, position: "fixed" },
);

/** 是否显示；visibility-height 是数字时组件按滚动距离自己更新它 */
const visible = defineModel<boolean>({ default: false });

type Scroller = HTMLElement | Window;
function target(): Scroller | null {
  const t = props.listenTo;
  if (t === undefined) return window;
  return typeof t === "string" ? document.querySelector<HTMLElement>(t) : t;
}
const scrollTop = (s: Scroller) => (s instanceof Window ? s.scrollY : s.scrollTop);

let bound: Scroller | null = null;
function update() {
  if (bound && props.visibilityHeight !== false) visible.value = scrollTop(bound) > props.visibilityHeight;
}
function bind() {
  bound?.removeEventListener("scroll", update);
  bound = props.visibilityHeight === false ? null : target();
  bound?.addEventListener("scroll", update, { passive: true });
  update();
}
onMounted(bind);
watch(() => [props.listenTo, props.visibilityHeight], bind);
onBeforeUnmount(() => bound?.removeEventListener("scroll", update));

function toTop() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  (target() ?? window).scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
</script>

<template>
  <button
    type="button"
    :class="['ak-fab', { 'ak-fab--absolute': position === 'absolute', 'is-visible': visible }]"
    :aria-label="label"
    :title="label"
    :inert="!visible"
    @click="toTop"
  >
    <AkIcon :name="icon" :size="18" />
  </button>
</template>
