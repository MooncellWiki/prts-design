<script setup lang="ts">
import AkRange, { type RangeGrid } from "../AkRange.vue";

/** 行 r0..r1 × 列 c0..c1 整块 */
const block = (r0: number, r1: number, c0: number, c1: number) => {
  const g: [number, number][] = [];
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) g.push([r, c]);
  return g;
};

const ranges: { title: string; grids: RangeGrid[] }[] = [
  // 陈：正前方一格（= range_table 的 grids 原样）
  { title: "近战 · 1-1", grids: [{ row: 0, col: 0 }, { row: 0, col: 1 }] },
  { title: "远程 · 3-3", grids: block(-1, 1, 0, 3) },
  { title: "阵法 · x-4", grids: block(-1, 1, -1, 1) },
  // 外接矩形里不在范围内的格不画
  { title: "空格不画", grids: [[-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]] },
];
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-6 ak-items-start">
    <div v-for="r in ranges" :key="r.title">
      <div class="ak-overline ak-mb-2">{{ r.title }}</div>
      <AkRange :grids="r.grids" />
    </div>
  </div>
</template>
