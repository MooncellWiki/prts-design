<script setup lang="ts" generic="T extends object">
import { computed } from "vue";

import type { DataTableColumn, DataTableSort } from "./types";

/**
 * 数据表（= Naive 的 NDataTable，精简）：columns + data 渲染成 <table class="ak-table">。
 * 单元格默认是 row[key]；自定义用 #cell-<key> 插槽或列的 render。可排序的列表头里放一枚 <button>（WAI-ARIA APG Sortable Table），
 * 当前排序列标 aria-sort，↑ / ↓ 由 CSS 画。不做分页 / 勾选 / 固定列——CSS 没有这些。
 */
const props = withDefaults(
  defineProps<{
    /** 列定义：key 取值字段 · title 表头 · num 数字列 · sorter 可排序 · render 自定义单元格 · className */
    columns: DataTableColumn<T>[];
    /** 行数据 */
    data: T[];
    /** 行的唯一标识（同 Naive 的 row-key）；不写用原始下标 */
    rowKey?: (row: T) => string | number;
    /** 行的额外类名（同 Naive 的 row-class-name）：给当前行 / 选中行加 is-selected（淡主色底） */
    rowClassName?: string | ((row: T, index: number) => string | undefined);
    /** 斑马纹 */
    striped?: boolean;
    /** 紧凑：格内边距 4 / 8 */
    compact?: boolean;
    /** 表格的可访问名（aria-label）；上方已有标题说明这张表时可以不写 */
    label?: string;
  }>(),
  { rowKey: undefined, rowClassName: undefined, label: undefined },
);

/** 排序状态 { key, order: "ascending" | "descending" }，null = 原顺序；点可排序的表头依次切换 升序 → 降序 → 原顺序 */
const sort = defineModel<DataTableSort | null>({ default: null });

defineSlots<
  {
    /** 没有数据时整行显示的内容（默认「暂无数据」） */
    empty?: () => unknown;
  } & {
    /** 某一列的单元格：#cell-<列 key>="{ row, index, value }"（优先于列的 render） */
    [K in `cell-${string}`]?: (p: { row: T; index: number; value: unknown }) => unknown;
  }
>();

const get = (row: T, key: string) => (row as Record<string, unknown>)[key];
const compare = (a: unknown, b: unknown) =>
  typeof a === "number" && typeof b === "number" ? a - b : String(a ?? "").localeCompare(String(b ?? ""), "zh-Hans-CN", { numeric: true });

const rows = computed(() => {
  const list = props.data.map((row, index) => ({ row, index }));
  const s = sort.value;
  const col = s && props.columns.find(c => c.key === s.key);
  if (!s || !col?.sorter) return list;
  const cmp = typeof col.sorter === "function" ? col.sorter : (a: T, b: T) => compare(get(a, col.key), get(b, col.key));
  const dir = s.order === "ascending" ? 1 : -1;
  return list.sort((a, b) => cmp(a.row, b.row) * dir || a.index - b.index);
});

const ariaSort = (c: DataTableColumn<T>) => (sort.value?.key === c.key ? sort.value.order : undefined);

function toggle(c: DataTableColumn<T>) {
  const s = sort.value;
  sort.value = s?.key !== c.key ? { key: c.key, order: "ascending" } : s.order === "ascending" ? { key: c.key, order: "descending" } : null;
}

const rowClass = (row: T, i: number) => (typeof props.rowClassName === "function" ? props.rowClassName(row, i) : props.rowClassName);

/** 把 render 的返回值原样渲染 */
const Render = (p: { content: () => unknown }) => p.content();
</script>

<template>
  <table :class="['ak-table', { 'ak-table--striped': striped, 'ak-table--compact': compact }]" :aria-label="label">
    <thead>
      <tr>
        <th v-for="c in columns" :key="c.key" scope="col" :class="[c.num && 'num', c.className]" :aria-sort="ariaSort(c)">
          <button v-if="c.sorter" type="button" class="ak-table__sort" @click="toggle(c)">{{ c.title }}</button>
          <template v-else>{{ c.title }}</template>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(r, i) in rows" :key="rowKey ? rowKey(r.row) : r.index" :class="rowClass(r.row, i)">
        <td v-for="c in columns" :key="c.key" :class="[c.num && 'num', c.className]">
          <slot :name="`cell-${c.key}`" :row="r.row" :index="i" :value="get(r.row, c.key)">
            <Render v-if="c.render" :content="() => c.render!(r.row, i)" />
            <template v-else>{{ get(r.row, c.key) }}</template>
          </slot>
        </td>
      </tr>
      <tr v-if="!rows.length">
        <td :colspan="columns.length" class="ak-fg-muted"><slot name="empty">暂无数据</slot></td>
      </tr>
    </tbody>
  </table>
</template>
