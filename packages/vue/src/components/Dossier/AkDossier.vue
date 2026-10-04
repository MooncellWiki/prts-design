<script setup lang="ts">
/**
 * 档案条目（= 现网 {{人员档案}} 的一段）：标题行（中文 + 可选的英文小标 + 紧跟其后的解锁条件）+ 正文。
 * 正文里的 <p> 保留换行（white-space: pre-line），游戏文本的 \n 可以原样放进一个 <p>。
 * 干员页的 9 段档案在一块折叠面板里依次排下来（同现网「————人员档案」那张折叠表），段与段首尾相接。
 */
defineProps<{
  /** 标题（客观履历） */
  title: string;
  /** 英文小标（Objective Record）；干员页 9 段成组出现时不写 */
  en?: string;
  /** 解锁条件（提升信赖至25%以查看更多信息），紧跟标题；locked 时也是遮罩上的文字 */
  unlock?: string;
  /** 未解锁：正文模糊、不可选，盖斜纹 + 🔒 解锁条件（文本仍在 DOM 里，可被搜索） */
  locked?: boolean;
}>();

defineSlots<{
  /** 正文：若干 <p>——游戏原文原样放，基础档案、综合体检也一样（不拆成键值表） */
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
