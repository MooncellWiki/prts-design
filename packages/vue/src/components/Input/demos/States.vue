<script setup lang="ts">
import AkInput from "../AkInput.vue";
</script>

<template>
  <div class="ak-grid-2 ak-gap-4">
    <AkInput label="禁用" model-value="不可编辑" disabled />
    <AkInput label="只读" model-value="2880" readonly />
    <AkInput label="出错" model-value="???" status="error" />
    <AkInput label="通过" model-value="SilverAsh" status="success" />
  </div>
</template>
