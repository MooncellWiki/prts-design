<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkButton from "../../Button/AkButton.vue";
import AkTag from "../../Tag/AkTag.vue";
import AkCard from "../AkCard.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <AkCard :cover="asset('ui/default_breaking_news.png')" eyebrow="Chapter 08" title="怒号光明" hoverable>
      <p class="ak-fs-sm ak-fg-2 ak-mb-0">卡片：1px 边框、直角、悬停时青色描边与上移 2px。</p>
      <template #footer>
        <span class="ak-fs-xs ak-fg-muted ak-grow">2026-08-01</span>
        <AkButton size="sm" variant="outline" href="#">查看</AkButton>
      </template>
    </AkCard>
    <AkCard :cover="asset('mainpage/banner-is6.jpg')" eyebrow="Integrated Strategies #6" title="沉沦者的黑流树海" horizontal>
      <p class="ak-fs-sm ak-fg-2 ak-mb-2">横排：封面在左占 40%，正文在右。</p>
      <div class="ak-tags"><AkTag size="sm" variant="outline">常驻</AkTag><AkTag size="sm" variant="accent-soft">集成战略</AkTag></div>
    </AkCard>
  </div>
</template>
