<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkBackTop from "../AkBackTop.vue";

const shown = ref(true);
</script>

<template>
  <div class="ak-relative ak-border ak-bg-surface ak-p-4">
    <p>不看滚动（<code>:visibility-height="false"</code>），显隐完全由 v-model 控制。</p>
    <AkButton size="sm" @click="shown = !shown">{{ shown ? "隐藏" : "显示" }}</AkButton>
    <p class="ak-fs-sm ak-fg-muted ak-mb-0">v-model = {{ shown }}</p>
    <AkBackTop v-model="shown" position="absolute" :visibility-height="false" />
  </div>
</template>
