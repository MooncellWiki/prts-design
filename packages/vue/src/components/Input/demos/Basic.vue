<script setup lang="ts">
import { ref } from "vue";

import AkInput from "../AkInput.vue";

const name = ref("");
const note = ref("");
</script>

<template>
  <div class="ak-grid-2 ak-gap-6">
    <AkInput v-model="name" label="干员名称" placeholder="例如：陈" />
    <AkInput v-model="note" type="textarea" label="备注" placeholder="部署位置、技能专精顺序…" :maxlength="200" />
  </div>
</template>
