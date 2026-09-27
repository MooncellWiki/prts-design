<script setup lang="ts">
/** 一条解锁条件：精英化 / 潜能图标 + 字 */
export interface TalentRequirement {
  /** 图标地址（elite_N / potential_N） */
  icon?: string;
  /** 「精英二 · 1级」「潜能5」 */
  text: string;
}

withDefaults(
  defineProps<{
    /** 天赋名 */
    name: string;
    /** 解锁条件，跟在名字后面（小号标签字） */
    requirements?: TalentRequirement[];
  }>(),
  { requirements: () => [] },
);

defineSlots<{
  /** 描述（游戏原始标记可以套 AkRichText） */
  default?: () => unknown;
}>();
</script>

<template>
  <div class="ak-talent">
    <div class="ak-talent__name">
      {{ name }}
      <span v-for="(r, i) in requirements" :key="i" class="ak-talent__req"><img v-if="r.icon" :src="r.icon" alt="" />{{ r.text }}</span>
    </div>
    <div v-if="$slots.default" class="ak-talent__desc"><slot /></div>
  </div>
</template>
