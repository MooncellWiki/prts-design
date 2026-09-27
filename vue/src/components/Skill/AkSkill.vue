<script setup lang="ts">
import { computed } from "vue";

import AkSp from "../Sp/AkSp.vue";
import AkSpTrigger from "../Sp/AkSpTrigger.vue";
import AkSpValue from "../Sp/AkSpValue.vue";
import type { SpType } from "../Sp/sp";

const props = withDefaults(
  defineProps<{
    /** 技能名 */
    name: string;
    /** 技能图标地址（游戏 skill_icon，64px 见方） */
    icon?: string;
    /** 技力回复方式：决定图标描边 + 底条色与 SP 标签；auto 自动回复 · attack 攻击回复 · hit 受击回复 · passive 被动 */
    spType?: SpType;
    /** 触发方式：manual 手动触发 · auto 自动触发；不写不显示（被动技能） */
    trigger?: "manual" | "auto";
    /** 技力消耗；不写不显示 */
    cost?: number | string;
    /** 初始技力；不写不显示 */
    init?: number | string;
    /** 持续时间：数字按秒写成「25s」，字符串原样（「—」）；不写不显示 */
    duration?: number | string;
    /** 开放条件（「技能2 · 精英一开放」），显示在右侧槽 */
    unlock?: string;
    /** 开放条件前的精英化图标地址 */
    unlockIcon?: string;
    /** 选中（蓝框 + 左上角标，游戏内 selected_back） */
    selected?: boolean;
    /** 未解锁：图标灰化 + 锁 */
    locked?: boolean;
    /** 技能名的标题级别（干员页正文里是 3，列表 / 侧栏里一般是 4） */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
  }>(),
  {
    icon: undefined,
    spType: "auto",
    trigger: undefined,
    cost: undefined,
    init: undefined,
    duration: undefined,
    unlock: undefined,
    unlockIcon: undefined,
    headingLevel: 4,
  },
);

const slots = defineSlots<{
  /** 技能描述（游戏原始标记可以套 AkRichText） */
  default?: () => unknown;
  /** 名称行末尾的附加内容（「未解锁」标签等） */
  "header-extra"?: () => unknown;
  /** 右侧槽（开放条件之后）：技能范围等；写了就是三栏的宽卡（.ak-skill--wide） */
  aside?: () => unknown;
}>();

const wide = computed(() => !!props.unlock || !!slots.aside);
const hasStats = computed(() => props.cost !== undefined || props.init !== undefined || props.duration !== undefined);
const durationText = computed(() => (typeof props.duration === "number" ? `${props.duration}s` : props.duration));
</script>

<template>
  <div :class="['ak-skill', { 'ak-skill--wide': wide, 'is-selected': selected }]">
    <div :class="['ak-skill__icon', `ak-skill__icon--${spType}`, { 'is-locked': locked }]">
      <img v-if="icon" :src="icon" alt="" />
    </div>
    <div>
      <div class="ak-skill__head">
        <component :is="`h${headingLevel}`" class="ak-skill__name">{{ name }}</component>
        <AkSp :sp-type="spType" />
        <AkSpTrigger v-if="trigger" :auto="trigger === 'auto'" />
        <slot name="header-extra" />
      </div>
      <div v-if="hasStats" class="ak-skill__stats">
        <span v-if="cost !== undefined"><AkSpValue kind="cost" :value="cost" /></span>
        <span v-if="init !== undefined"><AkSpValue kind="init" :value="init" /></span>
        <span v-if="duration !== undefined">持续 <b>{{ durationText }}</b></span>
      </div>
    </div>
    <div v-if="wide" class="ak-skill__aside">
      <span v-if="unlock" class="ak-skill__open"><img v-if="unlockIcon" :src="unlockIcon" alt="" />{{ unlock }}</span>
      <slot name="aside" />
    </div>
    <div v-if="$slots.default" class="ak-skill__desc"><slot /></div>
  </div>
</template>
