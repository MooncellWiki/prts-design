<script setup lang="ts">
import AkCard from "../AkCard.vue";
import AkCardGrid from "../AkCardGrid.vue";

const sections = [
  { eyebrow: "01 · Foundations", title: "基础", desc: "理念、色彩令牌（出处可追溯）、字体排印、装饰语言。" },
  { eyebrow: "02 · Chrome", title: "皮肤骨架 · 页眉与主题接口", desc: "黑色「终端」顶栏的构件、搜索面板、活动主题只改哪几个变量。" },
  { eyebrow: "03 · MediaWiki", title: "MediaWiki 内容样式", desc: ".mw-parser-output 里的一切：链接、列表、wikitable、图库、目录。" },
  { eyebrow: "04 · Components", title: "通用组件", desc: "按钮、标签、卡片面板、标签页、消息弹层、进度统计、表单。" },
  { eyebrow: "05 · Arknights", title: "方舟组件", desc: "稀有度职业、干员卡、道具材料、技能天赋、模组语音档案。" },
  { eyebrow: "06 · Pattern", title: "干员页整页样例（陈）", desc: "PRTS 最复杂的页面用这套系统搭一遍，数据取自 gamedata 2.7.61。" },
];
</script>

<template>
  <AkCardGrid>
    <AkCard v-for="s in sections" :key="s.eyebrow" :eyebrow="s.eyebrow" :title="s.title" accent="top" hoverable href="#">
      <p class="ak-fs-sm ak-fg-2 ak-mb-0">{{ s.desc }}</p>
    </AkCard>
  </AkCardGrid>
</template>
