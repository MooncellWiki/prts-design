<script setup lang="ts">
import { computed } from "vue";

/**
 * 分页（= Naive 的 NPagination，精简）：‹ 页码 … 页码 ›，当前页主色实底。
 * 不给 page-href 时页码是页内切换的 <button>；给了就渲染成 <a href>（MW 页面上真能打开的地址，同 CSS 版）。
 */
const props = withDefaults(
  defineProps<{
    /** 总页数；不写时由 itemCount ÷ pageSize 算出 */
    pageCount?: number;
    /** 总条数（配合 pageSize 算页数） */
    itemCount?: number;
    /** 每页条数（只在用 itemCount 算页数时有用） */
    pageSize?: number;
    /** 最多显示几格页码（含首页、尾页和省略号，同 Naive 的 page-slot，最少 5）；每格约 50px，窄处调小 */
    pageSlot?: number;
    /** 整组禁用 */
    disabled?: boolean;
    /** 页码链接：给了就渲染成 <a href="pageHref(n)">，点击照常跳转；不给就是 <button>，只更新 v-model */
    pageHref?: (page: number) => string;
    /** 导航地标的可访问名（nav 的 aria-label） */
    label?: string;
  }>(),
  { pageCount: undefined, itemCount: undefined, pageSize: 10, pageSlot: 7, pageHref: undefined, label: "分页" },
);

/** 当前页（从 1 数） */
const page = defineModel<number>({ default: 1 });

defineSlots<{
  /** 「上一页」按钮的内容（默认 ‹） */
  prev?: () => unknown;
  /** 「下一页」按钮的内容（默认 ›） */
  next?: () => unknown;
}>();

const count = computed(() => Math.max(1, props.pageCount ?? Math.ceil((props.itemCount ?? 0) / props.pageSize)));
const current = computed(() => Math.min(Math.max(1, page.value), count.value));

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** 页码格：数字 = 页码，"…" = 省略号。首尾页常驻、当前页居中，两边放不下的收成省略号（同 Naive 的算法，省略号不可点） */
const cells = computed<(number | "…")[]>(() => {
  const n = count.value;
  const c = current.value;
  const slot = Math.max(5, props.pageSlot);
  if (n <= slot) return range(1, n);
  const width = slot - 4; // 两个省略号之间的窗口
  const left = c - Math.floor((width - 1) / 2);
  const right = left + width - 1;
  if (left <= 3) return [...range(1, slot - 2), "…", n];
  if (right >= n - 2) return [1, "…", ...range(n - slot + 3, n)];
  return [1, "…", ...range(left, right), "…", n];
});

const tag = computed(() => (props.pageHref ? "a" : "button"));

/** <a> / <button> 各自的属性：禁用的链接去掉 href、标 aria-disabled；禁用的按钮用 disabled */
function attrs(target: number, off: boolean) {
  return props.pageHref ? { href: off ? undefined : props.pageHref(target), "aria-disabled": off || undefined } : { type: "button", disabled: off };
}

function go(target: number, e: MouseEvent) {
  if (props.disabled || target < 1 || target > count.value) return e.preventDefault();
  page.value = target;
}
</script>

<template>
  <nav class="ak-pagination" :aria-label="label">
    <component
      :is="tag"
      v-bind="attrs(current - 1, disabled || current <= 1)"
      :class="['ak-pagination__item', { 'is-disabled': disabled || current <= 1 }]"
      aria-label="上一页"
      @click="go(current - 1, $event)"
    >
      <slot name="prev">‹</slot>
    </component>
    <template v-for="(cell, i) in cells" :key="cell === '…' ? `gap-${i}` : cell">
      <span v-if="cell === '…'" class="ak-pagination__ellipsis" aria-hidden="true">…</span>
      <component
        :is="tag"
        v-else
        v-bind="attrs(cell, disabled)"
        :class="['ak-pagination__item', { 'is-active': cell === current, 'is-disabled': disabled }]"
        :aria-current="cell === current ? 'page' : undefined"
        :aria-label="`第 ${cell} 页`"
        @click="go(cell, $event)"
      >
        {{ cell }}
      </component>
    </template>
    <component
      :is="tag"
      v-bind="attrs(current + 1, disabled || current >= count)"
      :class="['ak-pagination__item', { 'is-disabled': disabled || current >= count }]"
      aria-label="下一页"
      @click="go(current + 1, $event)"
    >
      <slot name="next">›</slot>
    </component>
  </nav>
</template>
