<script setup lang="ts">
import AkSelect from "../AkSelect.vue";

const servers = [
  { label: "国服", value: "cn" },
  { label: "B 服", value: "bili" },
  { label: "国际服", value: "global" },
];
</script>

<template>
  <div class="ak-grid-3 ak-gap-4 ak-items-center">
    <AkSelect size="sm" :options="servers" model-value="cn" label="服务器（小）" />
    <AkSelect :options="servers" model-value="cn" label="服务器" />
    <AkSelect size="lg" :options="servers" model-value="cn" label="服务器（大）" />
    <AkSelect :options="servers" model-value="bili" disabled label="服务器（禁用）" />
    <AkSelect :options="servers" placeholder="未选择" status="error" label="服务器（出错）" />
    <AkSelect :options="servers" model-value="global" status="success" label="服务器（通过）" />
  </div>
</template>
