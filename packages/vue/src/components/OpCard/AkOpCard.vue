<script setup lang="ts">
import { computed } from "vue";

import AkRarity, { type Rarity } from "../Rarity/AkRarity.vue";

const props = withDefaults(
  defineProps<{
    /** 干员名 */
    name: string;
    /** 名字下的小字（Bender 大写）：英文名 · 编号（Ch'en · LM04）/ 生日 / 获得方式 */
    sub?: string;
    /** 头像地址（正方形，avatar/char_xxx_2.png） */
    avatar: string;
    /** 稀有度 1–6：头像的稀有度色渐变底（rail 时另加左边条），并作右下角星级的 alt */
    rarity: Rarity;
    /** 右下角星级原图地址（rarity/rarity_yellow_{rarity−1}.png）；不传时画 CSS 星形 */
    rarityIcon?: string;
    /** 职业名：左上角职业图标的 alt */
    profession?: string;
    /** 左上角职业图标地址：md / lg 用 profession/<职业>.png，sm 用头像同款小图标 profession/icon_<职业>.png；不传不显示 */
    professionIcon?: string;
    /** 精英阶段 0–2：左下角精英图标的 alt */
    elite?: 0 | 1 | 2;
    /** 左下角精英图标地址（elite/elite_N.png）；不传不显示 */
    eliteIcon?: string;
    /** 尺寸：sm 88 · md 128 · lg 180（px 宽）；放进 AkOpGrid 时宽度由网格定 */
    size?: "sm" | "md" | "lg";
    /** 外观：default 稀有度只看头像底 · rail 另加稀有度色左边条（与 1px 框直角拼接） */
    variant?: "default" | "rail";
    /** 链接到干员页；不写渲染成 <div> */
    href?: string;
    /** 当前项（异格一览里正在看的这位）：青色描边 + aria-current="page" */
    current?: boolean;
    /** 纯头像（首页「亮点干员」）：不出名字栏，名字改作头像的 alt 与悬停提示（title，可用透传的 title 改写）；sub 不显示 */
    avatarOnly?: boolean;
  }>(),
  {
    sub: undefined,
    rarityIcon: undefined,
    profession: undefined,
    professionIcon: undefined,
    elite: undefined,
    eliteIcon: undefined,
    size: "md",
    variant: "default",
    href: undefined,
  },
);

defineSlots<{
  /** 头像右上角的角标（.ak-op-card__badge：首页「兑」字标、模组类型小图标…） */
  badge?: () => unknown;
}>();

const CN = ["零", "一", "二", "三", "四", "五", "六"];

const classes = computed(() => [
  "ak-op-card",
  "ak-not-prose",
  props.size !== "md" && `ak-op-card--${props.size}`,
  { "ak-op-card--rail": props.variant === "rail", "is-current": props.current },
]);
</script>

<template>
  <!-- 整块是链接：ak-not-prose 挡掉正文的 a:visited / a:hover 链接色 -->
  <component
    :is="href ? 'a' : 'div'"
    :class="classes"
    :href="href"
    :data-rarity="rarity"
    :aria-current="current ? 'page' : undefined"
    :title="avatarOnly ? name : undefined"
  >
    <span class="ak-op-card__portrait">
      <img :src="avatar" :alt="avatarOnly ? name : ''" />
      <span class="ak-op-card__rarity">
        <img v-if="rarityIcon" :src="rarityIcon" :alt="`${CN[rarity]}星`" />
        <AkRarity v-else :value="rarity" />
      </span>
      <span v-if="professionIcon" class="ak-op-card__prof"><img :src="professionIcon" :alt="profession ?? ''" /></span>
      <span v-if="eliteIcon" class="ak-op-card__elite"><img :src="eliteIcon" :alt="elite === undefined ? '' : `精英${CN[elite]}`" /></span>
      <span v-if="$slots.badge" class="ak-op-card__badge"><slot name="badge" /></span>
    </span>
    <span v-if="!avatarOnly" class="ak-op-card__name">{{ name }}<span v-if="sub" class="ak-op-card__sub">{{ sub }}</span></span>
  </component>
</template>
