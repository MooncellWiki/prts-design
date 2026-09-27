<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 图片地址：默认是现网拼好的「道具_带框_<名>.png」（底框 + 图标）；bare 时是裸图标 */
    src: string;
    /** 道具名：作 alt，并默认作悬停提示 */
    name: string;
    /** 数量：数字或写好的串（"30K" / "99+"）；不写不显示。inline 时显示成图后的「×数量」 */
    count?: number | string;
    /** 数量不足（红字） */
    insufficient?: boolean;
    /** 尺寸：sm 40 · md 56 · lg 76（px）；inline 时固定 22 */
    size?: "sm" | "md" | "lg";
    /** 裸图标：底框由 CSS 按 rarity 画（只有 torappu 透明图标、没有合成图时用） */
    bare?: boolean;
    /** bare 时的底框稀有度 1–6（白 / 绿 / 蓝 / 紫 / 金 / 特殊） */
    rarity?: 1 | 2 | 3 | 4 | 5 | 6;
    /** 去色（未获得 / 不可用） */
    disabled?: boolean;
    /** 招聘合同那种：叠在底图空框里的干员头像；inline 时不显示 */
    avatar?: string;
    /** 链接到道具页 */
    href?: string;
    /** 悬停提示（data-ak-tip）：默认是 name，可改写；false 关掉 */
    tip?: string | false;
    /** 行内：22px 小图 + 文字，放在正文里（龙门币×30000）；文字默认是「×count」，可用默认插槽改写 */
    inline?: boolean;
  }>(),
  { count: undefined, size: "md", rarity: undefined, avatar: undefined, href: undefined, tip: undefined },
);

const classes = computed(() => [
  "ak-item",
  !props.inline && props.size !== "md" && `ak-item--${props.size}`,
  { "ak-item--bare": props.bare, "is-disabled": props.disabled },
]);
const tipText = computed(() => (props.tip === false ? undefined : (props.tip ?? props.name)));
</script>

<template>
  <component :is="href ? 'a' : 'span'" v-if="inline" class="ak-item-inline" :href="href" :data-ak-tip="tipText">
    <span :class="classes" :data-rarity="bare ? rarity : undefined"><img :src="src" :alt="name" /></span>
    <span v-if="$slots.default || count !== undefined" :class="insufficient ? 'ak-fg-danger' : undefined"><slot>×{{ count }}</slot></span>
  </component>
  <component
    :is="href ? 'a' : 'span'"
    v-else
    :class="classes"
    :href="href"
    :data-rarity="bare ? rarity : undefined"
    :data-ak-tip="tipText"
  >
    <img :src="src" :alt="name" />
    <img v-if="avatar" class="ak-item__avatar" :src="avatar" alt="" />
    <span v-if="count !== undefined" :class="['ak-item__count', { 'is-short': insufficient }]">{{ count }}</span>
  </component>
</template>
