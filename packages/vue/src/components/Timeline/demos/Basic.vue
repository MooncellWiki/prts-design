<script setup lang="ts">
import AkTimeline from "../AkTimeline.vue";
import AkTimelineItem from "../AkTimelineItem.vue";
</script>

<template>
  <AkTimeline>
    <AkTimelineItem time="2019.04.30" title="公开测试开启" content="明日方舟正式上线。" status="done" />
    <AkTimelineItem time="2026.08.01" title="2.7.61 版本" content="当前数据版本。" status="active" />
    <AkTimelineItem time="TBA" title="下一版本" />
  </AkTimeline>
</template>
