<script setup lang="ts">
import AkMessage from "../AkMessage.vue";
</script>

<template>
  <div>
    <AkMessage title="信息">数据来自游戏版本 2.7.61。</AkMessage>
    <AkMessage variant="success">已同步 Cargo 表。</AkMessage>
    <AkMessage variant="warning">本页含未实装内容。</AkMessage>
    <AkMessage variant="danger" title="危险区域" stripes>删除操作不可撤销。</AkMessage>
    <AkMessage variant="accent">新版皮肤试运行中：界面问题请到<a href="#">反馈页</a>留言。</AkMessage>
    <AkMessage variant="neutral" :show-icon="false" class="ak-fs-xs">
      这是<b>干员页整页样例</b>（信息结构 1:1 取自 prts.wiki 现网「陈」页面的 19 个章节，数据取自 gamedata 2.7.61）。
    </AkMessage>
  </div>
</template>
