<script setup lang="ts">
/**
 * 档案类卡片（干员密录 / 悖论模拟 / 未获得时档案）——现网那几张「————xx」折叠 wikitable 的替身。
 * 结构同 Naive 的 NCard：头（小标 + 标题 + 右侧解锁条件）+ 体 + #footer 页脚（阅读 / 关卡 / 首通奖励）；与 AkDossier 同一张脸。
 */
withDefaults(
  defineProps<{
    /** 标题（h4） */
    title: string;
    /** 标题前的小标（密录 1 / 悖论模拟） */
    kicker?: string;
    /** 解锁条件（纯文本）；要放精英 / 信赖 / 关卡号时改用 #unlock 插槽 */
    unlock?: string;
    /** 解锁条件前的小标 */
    unlockLabel?: string;
  }>(),
  { kicker: undefined, unlock: undefined, unlockLabel: "解锁条件" },
);

defineSlots<{
  /** 正文：若干 <p>（保留换行） */
  default?: () => unknown;
  /** 解锁条件（代替 unlock） */
  unlock?: () => unknown;
  /** 页脚：AkArchivePlay「阅读密录」、关卡、首通奖励 … */
  footer?: () => unknown;
}>();
</script>

<template>
  <div class="ak-archive">
    <div class="ak-archive__head">
      <span v-if="kicker" class="ak-archive__kicker">{{ kicker }}</span>
      <h4 class="ak-archive__title">{{ title }}</h4>
      <span v-if="unlock || $slots.unlock" class="ak-archive__req">
        <span class="ak-overline">{{ unlockLabel }}</span>
        <slot name="unlock">{{ unlock }}</slot>
      </span>
    </div>
    <div class="ak-archive__body"><slot /></div>
    <div v-if="$slots.footer" class="ak-archive__foot"><slot name="footer" /></div>
  </div>
</template>
