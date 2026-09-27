<script setup lang="ts">
import AkButton from "../../Button/AkButton.vue";
import AkHero from "../AkHero.vue";
</script>

<template>
  <AkHero
    eyebrow="生息演算 · 七周年庆典"
    title="Reclamation Algorithm"
    subtitle="重启锚点"
    description="生息演算「重启锚点」随七周年庆典开放（2026.05.01 10:00）。"
    :side="false"
  >
    <div class="ak-flex ak-wrap ak-gap-2 ak-mt-4">
      <AkButton variant="primary" href="#">活动页面</AkButton>
      <AkButton href="#">生息演算</AkButton>
    </div>
  </AkHero>
</template>
