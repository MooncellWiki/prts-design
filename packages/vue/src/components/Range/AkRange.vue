<script setup lang="ts">
import { computed } from "vue";

/** 一格：相对自身的行 / 列（= 游戏 range_table 的 grids 项），或写成 [row, col] */
export type RangeGrid = { row: number; col: number } | readonly [row: number, col: number];

const props = withDefaults(
  defineProps<{
    /** 可攻击的格子（相对自身）：{ row, col }（直接传 range_table 的 grids）或 [row, col]；col 向前为正，自身 (0, 0) 写不写都行 */
    grids: readonly RangeGrid[];
    /** 尺寸：sm 14 · md 22 · lg 28（px 格边）；sm 给技能卡侧槽 / 表格 */
    size?: "sm" | "md" | "lg";
    /** 可访问名（aria-label）；默认「攻击范围：自身之外 N 格」 */
    label?: string;
  }>(),
  { size: "md", label: undefined },
);

/** 同现网 Widget:Range：只铺范围的外接矩形（含自身），逐格给 self / on / 空（空格不写 class，CSS 不画） */
const layout = computed(() => {
  const on = new Set(props.grids.map(g => ("row" in g ? `${g.row},${g.col}` : `${g[0]},${g[1]}`)));
  on.delete("0,0");
  const pts = [[0, 0], ...[...on].map(k => k.split(",").map(Number))];
  const rows = pts.map(p => p[0]);
  const cols = pts.map(p => p[1]);
  const [r0, r1, c0, c1] = [Math.min(...rows), Math.max(...rows), Math.min(...cols), Math.max(...cols)];
  const cells: ("self" | "on" | undefined)[] = [];
  for (let r = r0; r <= r1; r++)
    for (let c = c0; c <= c1; c++) cells.push(r === 0 && c === 0 ? "self" : on.has(`${r},${c}`) ? "on" : undefined);
  return { cols: c1 - c0 + 1, cells, count: on.size };
});
</script>

<template>
  <div
    :class="['ak-range', size !== 'md' && `ak-range--${size}`]"
    :style="{ '--cols': layout.cols }"
    role="img"
    :aria-label="label ?? `攻击范围：自身之外 ${layout.count} 格`"
  >
    <i v-for="(c, i) in layout.cells" :key="i" :class="c" />
  </div>
</template>
