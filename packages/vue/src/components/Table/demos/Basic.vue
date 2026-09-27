<script setup lang="ts">
import AkDataTable from "../AkDataTable.vue";
import type { DataTableColumn } from "../types";

interface Phase {
  phase: string;
  maxLevel: number;
  hp: number;
  atk: number;
  def: number;
}

const columns: DataTableColumn<Phase>[] = [
  { key: "phase", title: "阶段" },
  { key: "maxLevel", title: "等级上限" },
  { key: "hp", title: "生命", num: true },
  { key: "atk", title: "攻击", num: true },
  { key: "def", title: "防御", num: true },
];

/** 陈，各阶段满级（不含信赖 / 潜能加成） */
const data: Phase[] = [
  { phase: "精英零", maxLevel: 50, hp: 1684, atk: 361, def: 221 },
  { phase: "精英一", maxLevel: 80, hp: 2188, atk: 469, def: 288 },
  { phase: "精英二", maxLevel: 90, hp: 2880, atk: 610, def: 352 },
];
</script>

<template>
  <AkDataTable
    :columns="columns"
    :data="data"
    :row-key="r => r.phase"
    :row-class-name="r => (r.phase === '精英一' ? 'is-selected' : undefined)"
    striped
    label="陈 · 各阶段满级属性"
  />
</template>
