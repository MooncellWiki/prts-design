<script setup lang="ts">
import AkTag from "../../Tag/AkTag.vue";
import AkTimeline from "../AkTimeline.vue";
import AkTimelineItem from "../AkTimelineItem.vue";

const events = [
  { time: "2026.08.01 16:00 — 08.15 03:59", title: "怒号光明（复刻）", type: "Side Story", status: "done" },
  { time: "2026.08.08 16:00 — 09.07 03:59", title: "奇象巡展", type: "限时活动", status: "active" },
  { time: "2026.08.19 10:00 — 09.02 03:59", title: "中坚甄选 14", type: "寻访", status: "active" },
] as const;
</script>

<template>
  <AkTimeline>
    <AkTimelineItem v-for="e in events" :key="e.title" :time="e.time" :status="e.status">
      <template #header>
        {{ e.title }} <AkTag size="sm" :variant="e.status === 'active' ? 'accent-soft' : 'default'">{{ e.type }}</AkTag>
      </template>
    </AkTimelineItem>
    <AkTimelineItem time="TBA" title="下一期活动">敬请期待。</AkTimelineItem>
  </AkTimeline>
</template>
