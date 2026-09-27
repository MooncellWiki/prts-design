<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkPhaseTabs from "../AkPhaseTabs.vue";

const icons = [0, 1, 2].map(n => asset(`elite/elite_${n}.png`));
const a = ref(1);
const b = ref(0);
const c = ref(0);
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-3">
    <!-- 三星干员（白雪）：最高精英一 -->
    <div class="ak-flex ak-gap-3 ak-items-center">
      <AkPhaseTabs v-model="a" :icons="icons" :max="1" /><span class="ak-fs-sm ak-fg-muted">三星 · max=1</span>
    </div>
    <!-- 一 / 二星：只有精英零 -->
    <div class="ak-flex ak-gap-3 ak-items-center">
      <AkPhaseTabs v-model="b" :icons="icons" :max="0" /><span class="ak-fs-sm ak-fg-muted">二星 · max=0</span>
    </div>
    <!-- 不传图标：只有文字 -->
    <div class="ak-flex ak-gap-3 ak-items-center">
      <AkPhaseTabs v-model="c" /><span class="ak-fs-sm ak-fg-muted">无图标</span>
    </div>
  </div>
</template>
