<script setup lang="ts">
import AkCbox from "../AkCbox.vue";
</script>

<template>
  <div>
    <AkCbox level="tip">如需了解<b>所有干员的上线时间</b>，可查阅<a href="#">干员上线时间一览</a>页面。</AkCbox>
    <AkCbox title="数据版本">本页数据取自游戏版本 2.7.61，与现网 wikitext 同步。</AkCbox>
    <AkCbox level="warning" icon="trash">
      <b>干员异格任务已于 2022 年 12 月 1 日被删除。</b>以下内容仅作存档，无法在当前版本游戏中查阅。
    </AkCbox>
    <AkCbox level="danger" title="剧透警告">以下内容涉及尚未在国服实装的剧情。</AkCbox>
    <AkCbox level="neutral">中性提示：不带等级色的编辑备注。</AkCbox>
  </div>
</template>
