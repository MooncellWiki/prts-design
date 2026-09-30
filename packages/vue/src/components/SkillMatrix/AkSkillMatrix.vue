<script setup lang="ts">
import { computed, nextTick, ref } from "vue";

import AkRichText from "../RichText/AkRichText.vue";
import LevelLabel from "../Skill/LevelLabel.vue";
import AkSpValue from "../Sp/AkSpValue.vue";
import type { SpValueKind } from "../Sp/sp";

/** 矩阵的一行：一个参数在各级的值 */
export interface SkillMatrixRow {
  /** 描述模板里的占位符名（{key}）；写了这一行就对应描述里的一个变量位 */
  key?: string;
  /** 参数名（「伤害倍率」「晕眩（秒）」）；sp 行是芯片里的字 */
  label: string;
  /** 用 SP 芯片当参数名：init 初始 · cost 消耗 · duration 持续 */
  sp?: SpValueKind;
  /** 各级的值（已经写好的字，「200%」）：第 i 项 = 等级 i+1，第 8–10 项 = 专精 Ⅰ–Ⅲ */
  values: (number | string)[];
}

const props = withDefaults(
  defineProps<{
    /** 参数行 */
    rows: SkillMatrixRow[];
    /** 描述模板（游戏原始标记）：只写一遍，{key} 变量位画成 .ak-var——平时是区间（200%→320%），悬停 / 选中某一列时换成该级的值 */
    description?: string;
    /** 专精 Ⅰ–Ⅲ 的图标地址（游戏 specialized_tiny_1–3）；不给时写 M1–M3 */
    masteryIcons?: readonly string[];
    /** 术语说明（termDescriptionDict），给描述里 <$ba.xxx> 的悬停提示 */
    terms?: Record<string, string>;
    /** 表格的可访问名（如「鞘击 · 各等级参数」） */
    label?: string;
  }>(),
  { description: undefined, masteryIcons: undefined, terms: undefined, label: undefined },
);

/** 钉住的一列（等级 1–10，没有是 undefined）：点列里任一格 / 列头按钮钉住、再点取消；可以和 AkSkillLevels 绑同一个值 */
const model = defineModel<number>();

defineSlots<{
  /** 表头卡：一般放 <AkSkill>（名称 / SP 类型 / 开放条件 / 范围） */
  header?: () => unknown;
  /** 表下的注释（.ak-skill-sheet__note，每条一个 <p>） */
  footer?: () => unknown;
  /** 自己画描述（代替 description）：level = 正在看的等级（没有是 undefined），value(key) = 该变量此刻该显示的字 */
  description?: (p: { level: number | undefined; value: (key: string) => string }) => unknown;
}>();

/** 列数 = 最长那行的值个数 */
const count = computed(() => Math.max(0, ...props.rows.map(r => r.values.length)));
const levels = computed(() => Array.from({ length: count.value }, (_, i) => i + 1));

/** 悬停 / 键盘聚焦中的列；离开就回到钉住的列 */
const hovered = ref<number>();
const shown = computed(() => hovered.value ?? model.value);

/** 变量位此刻的字：看某一列时是该级的值，否则是「首级→末级」区间（没变化就一个值） */
function valueOf(key: string): string {
  const row = props.rows.find(r => r.key?.toLowerCase() === key.toLowerCase());
  if (!row) return `{${key}}`;
  if (shown.value) return String(row.values[shown.value - 1] ?? "");
  const first = String(row.values[0] ?? "");
  const last = String(row.values.at(-1) ?? "");
  return first === last ? first : `${first}→${last}`;
}

/** 格子的类名：7 与专精 Ⅰ 之间的分隔 .m-start、列头专精色 .is-mastery、当前列 .is-hl、较上一级有变化 .is-up */
function cellClass(level: number, extra?: Record<string, boolean>) {
  const c = [level === 8 && "m-start", level === shown.value && "is-hl", ...Object.entries(extra ?? {}).map(([k, v]) => v && k)];
  return c.filter(Boolean).join(" ") || undefined;
}
const isUp = (row: SkillMatrixRow, i: number) => i === 0 || String(row.values[i]) !== String(row.values[i - 1]);

/** 鼠标：悬停某格 → 整列高亮；点某格 → 钉住 / 取消（第 0 列是参数名，不算） */
function columnOf(e: Event) {
  const cell = (e.target as Element).closest("th, td") as HTMLTableCellElement | null;
  return cell && cell.cellIndex > 0 && cell.cellIndex <= count.value ? cell.cellIndex : null;
}
function onOver(e: MouseEvent) {
  const col = columnOf(e);
  if (col) hovered.value = col;
}
function onClick(e: MouseEvent) {
  const col = columnOf(e);
  if (col) model.value = model.value === col ? undefined : col;
}

/** 列头按钮：roving tabindex（Tab 只停一个：上次聚焦的列，否则钉住的列，否则第 1 列），←/→/Home/End 在列间移动；聚焦即预览该列，Enter / Space 钉住 */
const focused = ref<number>();
const tabStop = computed(() => focused.value ?? model.value ?? 1);
function onFocus(level: number) {
  focused.value = level;
  hovered.value = level;
}
function onKey(e: KeyboardEvent, level: number) {
  const n = count.value;
  const to =
    e.key === "ArrowRight" ? (level % n) + 1
    : e.key === "ArrowLeft" ? ((level - 2 + n) % n) + 1
    : e.key === "Home" ? 1
    : e.key === "End" ? n
    : undefined;
  if (!to) return;
  e.preventDefault();
  const row = (e.currentTarget as HTMLElement).closest("tr")!;
  nextTick(() => row.cells[to]?.querySelector("button")?.focus());
}
</script>

<template>
  <div class="ak-skill-sheet">
    <slot name="header" />
    <div v-if="description !== undefined || $slots.description" class="ak-skill-sheet__tpl">
      <slot name="description" :level="shown" :value="valueOf">
        <AkRichText :text="description" :terms="terms">
          <template #var="{ key }"><span class="ak-var" :data-var="key">{{ valueOf(key) }}</span></template>
        </AkRichText>
      </slot>
    </div>
    <!-- data-no-toggle：皮肤脚本会给页面里的 .ak-skill-matrix 绑一套列高亮 / .ak-var 换值（wikipage.content 时也会扫），这里自己管 -->
    <table class="ak-skill-matrix" :aria-label="label" data-no-toggle @mouseover="onOver" @mouseleave="hovered = undefined" @click="onClick">
      <colgroup><col class="label" /></colgroup>
      <thead>
        <tr>
          <th scope="col">等级</th>
          <th v-for="lv in levels" :key="lv" scope="col" :class="cellClass(lv, { 'is-mastery': lv > 7 })">
            <button
              type="button"
              :aria-pressed="model === lv"
              :tabindex="lv === tabStop ? 0 : -1"
              @focus="onFocus(lv)"
              @blur="hovered = undefined"
              @keydown="onKey($event, lv)"
            >
              <LevelLabel :level="lv" :icons="masteryIcons" numeral />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, r) in rows" :key="row.key ?? r" :data-var="row.key">
          <th scope="row">
            <AkSpValue v-if="row.sp" :kind="row.sp">{{ row.label }}</AkSpValue>
            <template v-else>{{ row.label }}</template>
          </th>
          <td v-for="lv in levels" :key="lv" :class="cellClass(lv, { 'is-up': isUp(row, lv - 1) })">{{ row.values[lv - 1] }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="$slots.footer" class="ak-skill-sheet__note"><slot name="footer" /></div>
  </div>
</template>
