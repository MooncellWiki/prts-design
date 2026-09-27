<script setup lang="ts">
import { computed, ref } from "vue";

import AkInput from "../../Input/AkInput.vue";
import AkField from "../AkField.vue";

/** 关卡编号：主线 1-7、资源 CE-6、活动 SV-8 …… */
const stage = ref("1-7");
const valid = computed(() => /^[A-Z]{0,4}\d*-\d+$/.test(stage.value.trim()));
const status = computed(() => (!stage.value.trim() ? undefined : valid.value ? "success" : "error"));
const feedback = computed(() => (status.value === "error" ? "格式不正确：应为「章节-序号」，如 1-7、CE-6" : "如 1-7、CE-6、SV-8"));
</script>

<template>
  <div class="ak-grid-2 ak-gap-6">
    <AkField label="关卡编号" :validation-status="status" :feedback="feedback">
      <AkInput v-model="stage" />
    </AkField>
    <AkField label="出错的字段" validation-status="error" feedback="格式不正确">
      <AkInput model-value="???" />
    </AkField>
  </div>
</template>
