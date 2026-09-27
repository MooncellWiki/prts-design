<script setup lang="ts">
import { computed } from "vue";

import AkRichText from "../RichText/AkRichText.vue";

/** 天赋表的一行：一个条件下的效果 */
export interface TalentRow {
  /** 天赋名；相邻几行同名时合并成一格（rowspan） */
  name: string;
  /** 条件（「精英二 · Y模组 2级」）；要放精英化图标时用 #condition 插槽 */
  condition?: string;
  /** 描述：游戏原始标记（<@ba.vup>…</>），由 AkRichText 渲染 */
  description: string;
  /** 潜能加成后的描述（潜能开关打开时换成它；加成部分一般是 <@ba.talpu>（+1%）</>）；不写就没有潜能版 */
  potential?: string;
}

const props = withDefaults(
  defineProps<{
    /** 第一列的列头（「第一天赋」「第二天赋」） */
    title: string;
    /** 各条件下的效果 */
    rows: TalentRow[];
    /** 潜能开关上写的潜能等级（「潜能5」）；有任一行写了 potential 才出现开关 */
    potentialRank?: number;
    /** 潜能开关上的潜能图标地址（游戏 potential_N） */
    potentialIcon?: string;
    /** 表头显示「算法」开关——描述里用 AkCalc 标了加成项进公式的方式时打开；打开后表尾有图例行 */
    calcToggle?: boolean;
    /** 术语说明（termDescriptionDict），给描述里 <$ba.xxx> 的悬停提示 */
    terms?: Record<string, string>;
  }>(),
  { potentialRank: undefined, potentialIcon: undefined, terms: undefined },
);

/** 潜能加成开关：打开时描述换成潜能版（表上 .is-pot） */
const potential = defineModel<boolean>({ default: false });
/** 算法标记开关：打开时每个加成项前露出 AkCalc、表尾出图例（表上 .is-calc） */
const calc = defineModel<boolean>("calc", { default: false });

defineSlots<{
  /** 自己画条件格（放精英化图标等）：{ row, index } */
  condition?: (p: { row: TalentRow; index: number }) => unknown;
  /** 自己画描述（要标 AkCalc 时用）：potential = 这是潜能版还是基础版（有潜能版的行调两次） */
  description?: (p: { row: TalentRow; index: number; potential: boolean }) => unknown;
  /** 图例行末尾的附加内容（「详见 属性基本公式」链接） */
  legend?: () => unknown;
}>();

const hasPotential = computed(() => props.rows.some(r => r.potential !== undefined));

/** 同名相邻行合并：每组第一行记组长，其余记 0（不画名字格） */
const spans = computed(() =>
  props.rows.map((r, i) => {
    if (i > 0 && props.rows[i - 1].name === r.name) return 0;
    let n = 1;
    while (props.rows[i + n]?.name === r.name) n++;
    return n;
  }),
);

const CALC_LEGEND = [
  { kind: "add", text: "直接加算" },
  { kind: "mul", text: "直接乘算", note: "（直接乘算之间为加法计算）" },
  { kind: "fadd", text: "最终加算" },
  { kind: "fmul", text: "最终乘算" },
];
</script>

<template>
  <table :class="['ak-talent-table', { 'is-pot': potential, 'is-calc': calc }]">
    <thead>
      <tr>
        <th class="name" scope="col">{{ title }}</th>
        <th class="cond" scope="col">条件</th>
        <th class="desc" scope="col">
          描述<label v-if="hasPotential" class="ak-check ak-talent-table__toggle">
            <input v-model="potential" type="checkbox" />
            <span v-if="potentialIcon" class="ak-potential ak-potential--bare"><img :src="potentialIcon" alt="" /></span>
            潜能{{ potentialRank }}<span class="ak-sr-only">加成</span>
          </label>
          <label v-if="calcToggle" class="ak-check ak-talent-table__toggle"><input v-model="calc" type="checkbox" />算法</label>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="i">
        <td v-if="spans[i]" class="name" :rowspan="spans[i] > 1 ? spans[i] : undefined">{{ row.name }}</td>
        <td class="cond"><slot name="condition" :row="row" :index="i">{{ row.condition }}</slot></td>
        <td class="desc">
          <template v-if="row.potential !== undefined">
            <span class="ak-talent-table__base">
              <slot name="description" :row="row" :index="i" :potential="false">
                <AkRichText :text="row.description" :terms="terms" />
              </slot>
            </span>
            <span class="ak-talent-table__pot">
              <slot name="description" :row="row" :index="i" :potential="true">
                <AkRichText :text="row.potential" :terms="terms" />
              </slot>
            </span>
          </template>
          <slot v-else name="description" :row="row" :index="i" :potential="false">
            <AkRichText :text="row.description" :terms="terms" />
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="calcToggle">
      <tr class="ak-talent-table__legend">
        <td colspan="3">
          <span v-for="l in CALC_LEGEND" :key="l.kind">
            <i :class="['ak-calc', `ak-calc--${l.kind}`]" aria-hidden="true" />{{ l.text }}<small v-if="l.note">{{ l.note }}</small>
          </span>
          <slot name="legend" />
        </td>
      </tr>
    </tfoot>
  </table>
</template>
