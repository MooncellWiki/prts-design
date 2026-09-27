<script setup lang="ts">
import AkRarity, { type Rarity } from "../Rarity/AkRarity.vue";

/** 干员横向条目：列表 / 表格里一行一位——头像（稀有度色左边条）+ 名字 + 第二行小字 */
withDefaults(
  defineProps<{
    /** 干员名 */
    name: string;
    /** 头像地址（正方形，36px 显示） */
    avatar: string;
    /** 稀有度 1–6：头像左边的色条；stars 时第二行的星也按它画 */
    rarity?: Rarity;
    /** 第二行小字：分支 / 职业 / 获得方式 */
    meta?: string;
    /** 在第二行前面画稀有度星（按稀有度色阶着色；要写 rarity） */
    stars?: boolean;
    /** 链接到干员页；不写渲染成 <span> */
    href?: string;
  }>(),
  { rarity: undefined, meta: undefined, href: undefined },
);

defineSlots<{
  /** 第二行（代替 meta），可放标签 / 链接 */
  meta?: () => unknown;
}>();
</script>

<template>
  <!-- 整块是链接：ak-not-prose 挡掉正文的 a:visited / a:hover 链接色 -->
  <component :is="href ? 'a' : 'span'" class="ak-op-row ak-not-prose" :href="href">
    <span class="ak-avatar" :data-rarity="rarity"><img :src="avatar" alt="" /></span>
    <span>
      <span class="ak-op-row__name">{{ name }}</span>
      <span v-if="meta || $slots.meta || (stars && rarity)" class="ak-op-row__meta">
        <AkRarity v-if="stars && rarity" :value="rarity" variant="tier" size="sm" />
        <slot name="meta">{{ meta }}</slot>
      </span>
    </span>
  </component>
</template>
