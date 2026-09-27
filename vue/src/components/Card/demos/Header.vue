<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkTag from "../../Tag/AkTag.vue";
import AkCard from "../AkCard.vue";

const picked = ref<"s2" | "s3">("s3");
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <div class="ak-grid ak-grid-2 ak-gap-4">
      <AkCard title="赤霄·拔刀" :selected="picked === 's2'">
        <template #header-extra><AkTag v-if="picked === 's2'" variant="accent-soft" size="sm">selected</AkTag></template>
        <p class="ak-fs-sm ak-m-0">技能 2 · 攻击回复 · 手动触发</p>
        <template #footer><AkButton size="sm" :variant="picked === 's2' ? 'primary' : 'default'" @click="picked = 's2'">选为专精技能</AkButton></template>
      </AkCard>
      <AkCard title="赤霄·绝影" :selected="picked === 's3'">
        <template #header-extra><AkTag v-if="picked === 's3'" variant="accent-soft" size="sm">selected</AkTag></template>
        <p class="ak-fs-sm ak-m-0">技能 3 · 攻击回复 · 手动触发</p>
        <template #footer><AkButton size="sm" :variant="picked === 's3' ? 'primary' : 'default'" @click="picked = 's3'">选为专精技能</AkButton></template>
      </AkCard>
    </div>
    <AkCard title="数据版本" eyebrow="Gamedata" segmented title-tag="h3">
      <p class="ak-fs-sm ak-m-0">本页数据取自游戏版本 2.7.61。标题栏独立成一栏、下面一道分隔线（<code>segmented</code>）。</p>
    </AkCard>
  </div>
</template>
