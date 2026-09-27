<script setup lang="ts">
import { h, ref } from "vue";

import AkDataTable from "../AkDataTable.vue";
import type { DataTableColumn, DataTableSort } from "../types";

interface Operator {
  name: string;
  branch: string;
  profession: string;
  rarity: number;
  hp: number;
  atk: number;
  def: number;
  faction: string;
}

const columns: DataTableColumn<Operator>[] = [
  { key: "name", title: "干员" },
  {
    key: "rarity",
    title: "稀有度",
    sorter: true,
    // render 函数：稀有度星标（.ak-rarity）
    render: r => h("span", { class: ["ak-rarity", `ak-rarity--r${r.rarity}`, "ak-rarity--sm"], role: "img", "aria-label": `${r.rarity} 星` }, Array.from({ length: r.rarity }, () => h("i"))),
  },
  { key: "profession", title: "职业" },
  { key: "hp", title: "生命", num: true, sorter: true },
  { key: "atk", title: "攻击", num: true, sorter: true },
  { key: "def", title: "防御", num: true, sorter: true },
  { key: "faction", title: "阵营" },
];

/** 精英二满级 */
const data: Operator[] = [
  { name: "陈", branch: "剑豪", profession: "近卫", rarity: 6, hp: 2880, atk: 610, def: 352, faction: "龙门近卫局" },
  { name: "银灰", branch: "领主", profession: "近卫", rarity: 6, hp: 2880, atk: 660, def: 352, faction: "喀兰贸易" },
  { name: "德克萨斯", branch: "尖兵", profession: "先锋", rarity: 5, hp: 2050, atk: 545, def: 371, faction: "企鹅物流" },
  { name: "桃金娘", branch: "执旗手", profession: "先锋", rarity: 4, hp: 1583, atk: 386, def: 223, faction: "—" },
];

const sort = ref<DataTableSort | null>({ key: "atk", order: "descending" });
</script>

<template>
  <div>
    <AkDataTable v-model="sort" :columns="columns" :data="data" :row-key="r => r.name" label="干员属性">
      <template #cell-name="{ row }">
        <a :href="`#${row.name}`">{{ row.name }}</a> <span class="ak-fs-xs ak-fg-muted">{{ row.branch }}</span>
      </template>
    </AkDataTable>
    <p class="ak-fs-sm ak-fg-muted ak-mt-2 ak-mb-0">v-model = {{ JSON.stringify(sort) }}</p>
  </div>
</template>
