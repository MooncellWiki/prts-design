<script setup lang="ts">
/** 属性表的一格（思路同 Naive 的 NStatistic：小标签 + 大数值 + 单位），放在 AkAttrs 里 */
defineProps<{
  /** 属性名：英文缩写（HP / ATK …，Bender 大写小字）或直接写中文（物理强度） */
  name: string;
  /** 中文名：跟在英文缩写后，正文字体（生命上限） */
  zh?: string;
  /** 数值；要上色或放别的内容时改用默认插槽 */
  value?: string | number;
  /** 单位：数值后的小号灰字（s） */
  unit?: string;
  /** 强调：顶部 2px 主色线（面板里的四维用，部署类属性不用） */
  accent?: boolean;
}>();

defineSlots<{
  /** 数值（代替 value） */
  default?: () => unknown;
}>();
</script>

<template>
  <div :class="['ak-attr', { 'ak-attr--accent': accent }]">
    <span class="ak-attr__label">
      {{ name }}<span v-if="zh" class="cn">{{ zh }}</span>
    </span>
    <span class="ak-attr__value"><slot>{{ value }}</slot><small v-if="unit">{{ unit }}</small></span>
  </div>
</template>
