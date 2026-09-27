<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkCountdown from "../AkCountdown.vue";

const now = Date.now();
/** 示例截止时刻都相对「现在」取，读数固定 */
const event = now + (3 * 24 + 14) * 36e5 + 27.5 * 6e4;
const pool = now + 14 * 36e5 + 10.5 * 6e4;

/** 剿灭作战 & 周常任务刷新：下一个周一 04:00（服务器时间 UTC+8） */
function nextWeekly() {
  const cst = new Date(Date.now() + 8 * 36e5); // 挪到 UTC+8，下面一律用 UTC 读写
  const at = Date.UTC(cst.getUTCFullYear(), cst.getUTCMonth(), cst.getUTCDate(), 4);
  let add = (8 - cst.getUTCDay()) % 7;
  if (add === 0 && at <= cst.getTime()) add = 7;
  return at + add * 864e5 - 8 * 36e5;
}
const weekly = nextWeekly();

const active = ref(true);
const done = ref(false);
</script>

<template>
  <div class="ak-grid ak-gap-4">
    <div class="ak-flex ak-wrap ak-items-center ak-gap-3">
      <span class="ak-fs-sm ak-fg-muted">活动剩余</span>
      <AkCountdown :until="event" />
    </div>
    <div class="ak-flex ak-wrap ak-items-center ak-gap-3">
      <span class="ak-fs-sm ak-fg-muted">首页幻灯片（parts=2）</span>
      <AkCountdown :until="event" :parts="2" />
      <AkCountdown :until="pool" :parts="2" />
    </div>
    <div class="ak-flex ak-wrap ak-items-center ak-gap-3">
      <span class="ak-fs-sm ak-fg-muted">剿灭作战 &amp; 周常任务刷新 · 每周一 04:00</span>
      <AkCountdown :until="weekly" />
    </div>
    <div class="ak-flex ak-wrap ak-items-center ak-gap-3">
      <span class="ak-fs-sm ak-fg-muted">到秒 · duration 90 秒</span>
      <AkCountdown v-if="!done" :duration="90e3" precision="sec" :active="active" @finish="done = true" />
      <span v-else class="ak-fs-sm">已结束</span>
      <AkButton size="sm" :disabled="done" @click="active = !active">{{ active ? "暂停" : "继续" }}</AkButton>
    </div>
  </div>
</template>
