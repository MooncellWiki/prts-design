<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkCountdown from "../AkCountdown.vue";
import AkEvent from "../AkEvent.vue";

/** 示例里的截止时刻取「现在 + 3 天 14 小时 27 分」，读数总是 03 / 14 / 27；实际用活动的结束时间（"2026-09-07T03:59:00+08:00"） */
const until = Date.now() + (3 * 24 + 14) * 36e5 + 27.5 * 6e4;
</script>

<template>
  <div class="ak-grid-2 ak-gap-3 ak-items-start">
    <AkEvent
      status="live"
      kind="限时活动 · 进行中"
      title="奇象巡展"
      time="2026.08.08 16:00 — 09.07 03:59"
      :cover="asset('mainpage/banner-qixiang.jpg')"
    >
      <AkCountdown class="ak-mt-2" :until="until" />
    </AkEvent>
    <AkEvent
      status="ended"
      kind="寻访 · 已结束"
      title="联合行动 23"
      time="2026.08.12 10:00 — 08.26 03:59"
      :cover="asset('mainpage/banner-gacha-joint23.jpg')"
    />
  </div>
</template>
