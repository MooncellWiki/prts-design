<script setup lang="ts">
import AkDataTable from "../AkDataTable.vue";
import type { DataTableColumn } from "../types";

interface Stat {
  stat: string;
  e0l1: string;
  e0: string;
  e1: string;
  e2: string;
}

const columns: DataTableColumn<Stat>[] = [
  { key: "stat", title: "属性" },
  { key: "e0l1", title: "精英0 1级", num: true },
  { key: "e0", title: "精英0 满级", num: true },
  { key: "e1", title: "精英1 满级", num: true },
  { key: "e2", title: "精英2 满级", num: true },
];

/** 陈（不含信赖 / 潜能加成） */
const data: Stat[] = [
  { stat: "生命上限", e0l1: "1229", e0: "1684", e1: "2188", e2: "2880" },
  { stat: "攻击", e0l1: "249", e0: "361", e1: "469", e2: "610" },
  { stat: "防御", e0l1: "154", e0: "221", e1: "288", e2: "352" },
  { stat: "部署费用", e0l1: "19", e0: "19", e1: "21", e2: "23" },
  { stat: "攻击间隔", e0l1: "1.3s", e0: "1.3s", e1: "1.3s", e2: "1.3s" },
];
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <AkDataTable :columns="columns" :data="data" :row-key="r => r.stat" compact label="陈 · 属性" />
    <AkDataTable :columns="columns" :data="[]" compact label="空表">
      <template #empty>没有符合条件的数据</template>
    </AkDataTable>
  </div>
</template>
