<script setup lang="ts">
import AkDossier from "../AkDossier.vue";
import AkRedacted from "../AkRedacted.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkDossier title="客观履历" en="Objective Record" unlock="初始开放">
      <p>
        陈，龙门高级警司，龙门近卫局特别督察组组长，毕业于维多利亚皇家近卫学校，成绩优异，表现突出。在龙门近卫局供职期间，力主取缔龙门境内非法活动，对抗暴力犯罪和有组织犯罪，追缉武装逃犯与国际重犯等行动，并取得多项重大成果。
      </p>
      <p>现作为特别人员协助罗德岛行动，并为现场提供战术指挥支援。</p>
    </AkDossier>
    <!-- 涂黑：悬停 / 聚焦时显出，点一下常显 -->
    <AkDossier title="临床诊断分析" unlock="提升信赖至25%以查看更多信息">
      <p><AkRedacted>【应龙门近卫局要求，不予公开】</AkRedacted></p>
      <p>她是有来做体检啦，只是档案被拿走了，我这里可没留底。嗯？是龙门方面的要求啊。</p>
      <p class="ak-fg-muted">——医疗干员R.T.</p>
    </AkDossier>
  </div>
</template>
