<script setup lang="ts">
import AkTag from "../../Tag/AkTag.vue";
import AkPanel from "../AkPanel.vue";

const stages = [
  { code: "TO-EX-1", name: "电影防沉迷" },
  { code: "TO-EX-2", name: "邮包流水线" },
  { code: "TO-EX-3", name: "地下捉迷藏" },
  { code: "TO-EX-4", name: "处处是一撮毛" },
];
</script>

<template>
  <div>
    <AkPanel title="今日信息" en="Today" title-tag="h3">
      <template #header-extra><AkTag size="sm" variant="accent-soft">周五</AkTag></template>
      <p class="ak-fs-sm ak-m-0">面板：标题栏左侧色条 + 表面 2 底色。整块是一张面板——物资筹备、芯片搜索、时钟与周常倒计时都在里面，不各立一个框。</p>
    </AkPanel>
    <AkPanel title="新增关卡" en="Operations" title-tag="h3">
      <div class="ak-overline ak-mb-2">SideStory「直到大地变成一颗酸橙」</div>
      <ul class="ak-m-0">
        <li v-for="s in stages" :key="s.code"><a href="#">{{ s.code }} {{ s.name }}</a></li>
      </ul>
    </AkPanel>
  </div>
</template>
