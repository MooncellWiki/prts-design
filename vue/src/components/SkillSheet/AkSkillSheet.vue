<script setup lang="ts">
import AkRichText from "../RichText/AkRichText.vue";
import LevelLabel from "../Skill/LevelLabel.vue";
import AkSpValue from "../Sp/AkSpValue.vue";

/** 一个技能等级（第 i 项 = 等级 i+1，第 8–10 项 = 专精 Ⅰ–Ⅲ） */
export interface SkillSheetLevel {
  /** 描述：游戏原始标记（<@ba.vup>…</>、{atk_scale:0%}），由 AkRichText 渲染 */
  description: string;
  /** 描述里占位符的取值（这一级的 blackboard） */
  vars?: Record<string, number | string>;
  /** 初始技力 */
  init?: number | string;
  /** 技力消耗 */
  cost?: number | string;
  /** 持续时间（秒）；没有就空着（表里显示「—」） */
  duration?: number | string;
}

const props = withDefaults(
  defineProps<{
    /** 各级数据：1–7 级，之后是专精 Ⅰ–Ⅲ（三星及以下只有 7 项） */
    levels: SkillSheetLevel[];
    /** 高亮一行（当前等级，1–10）；常与 AkSkillLevels 的 v-model 绑同一个值 */
    highlight?: number;
    /** 专精 Ⅰ–Ⅲ 的图标地址（游戏 specialized_tiny_1–3）；不给时写 M1–M3 */
    masteryIcons?: readonly string[];
    /** 术语说明（termDescriptionDict），给描述里 <$ba.xxx> 的悬停提示 */
    terms?: Record<string, string>;
    /** 表格的可访问名（如「鞘击 · 各等级数据」） */
    label?: string;
  }>(),
  { highlight: undefined, masteryIcons: undefined, terms: undefined, label: undefined },
);

defineSlots<{
  /** 表头卡：一般放 <AkSkill>（名称 / SP 类型 / 开放条件 / 范围），不写 cost / init，名称行居中对齐图标 */
  header?: () => unknown;
  /** 表下的注释（.ak-skill-sheet__note，每条一个 <p>：「※不可对空」） */
  footer?: () => unknown;
  /** 自己画某一级的描述（代替 AkRichText）：{ row, level } */
  description?: (p: { row: SkillSheetLevel; level: number }) => unknown;
}>();

/** 行的类名：专精行 .is-mastery，高亮行 .is-hl；都没有时不输出 class */
const rowClass = (level: number) => [level > 7 && "is-mastery", level === props.highlight && "is-hl"].filter(Boolean).join(" ") || undefined;
/** 数值格：没有值时整格留空（CSS 的 :empty 画「—」），不能留空文字结点 */
const num = (v: number | string | undefined) => (v === undefined || v === "" ? "" : String(v));
</script>

<template>
  <div class="ak-skill-sheet">
    <slot name="header" />
    <table class="ak-skill-table" :aria-label="label">
      <thead>
        <tr>
          <th class="lv" scope="col">等级</th>
          <th class="desc" scope="col">描述</th>
          <th class="num" scope="col"><AkSpValue kind="init">初始</AkSpValue></th>
          <th class="num" scope="col"><AkSpValue kind="cost">消耗</AkSpValue></th>
          <th class="num" scope="col"><AkSpValue kind="duration">持续</AkSpValue></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in levels" :key="i" :class="rowClass(i + 1)" :aria-current="i + 1 === highlight || undefined">
          <td class="lv"><LevelLabel :level="i + 1" :icons="masteryIcons" numeral /></td>
          <td class="desc">
            <slot name="description" :row="row" :level="i + 1">
              <AkRichText :text="row.description" :vars="row.vars" :terms="terms" />
            </slot>
          </td>
          <td class="num" v-text="num(row.init)" />
          <td class="num" v-text="num(row.cost)" />
          <td class="num" v-text="num(row.duration)" />
        </tr>
      </tbody>
    </table>
    <div v-if="$slots.footer" class="ak-skill-sheet__note"><slot name="footer" /></div>
  </div>
</template>
