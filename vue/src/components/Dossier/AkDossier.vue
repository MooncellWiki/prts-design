<script setup lang="ts">
/**
 * 档案条目（= 现网 {{人员档案}} 的一段）：标题行（中文 + 英文小标 + 右侧解锁条件）+ 正文。
 * 正文里的 <p> 保留换行（white-space: pre-line），游戏文本的 \n 可以原样放进一个 <p>。
 * 干员页 9 段档案配竖排标签页：AkTabs placement="left" 的每个 AkTabPane 里放一个 AkDossier。
 */
defineProps<{
  /** 标题（客观履历） */
  title: string;
  /** 英文小标（Objective Record） */
  en?: string;
  /** 解锁条件（提升信赖至25%以查看更多信息），标题行右侧；locked 时也是遮罩上的文字 */
  unlock?: string;
  /** 未解锁：正文模糊、不可选，盖斜纹 + 🔒 解锁条件（文本仍在 DOM 里，可被搜索） */
  locked?: boolean;
}>();

defineSlots<{
  /** 正文：若干 <p>，或键值表 / 属性表 */
  default?: () => unknown;
}>();
</script>

<template>
  <div :class="['ak-dossier', { 'is-locked': locked }]" :data-unlock="locked ? unlock : undefined">
    <div class="ak-dossier__title">
      {{ title }}<span v-if="en" class="ak-en">{{ en }}</span><span v-if="unlock" class="ak-dossier__unlock">{{ unlock }}</span>
    </div>
    <slot />
  </div>
</template>
