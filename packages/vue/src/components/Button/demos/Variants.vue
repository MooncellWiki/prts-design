<script setup lang="ts">
import AkButton from "../AkButton.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
    <AkButton variant="primary">主要动作</AkButton>
    <AkButton variant="contrast">开始行动</AkButton>
    <AkButton>默认</AkButton>
    <AkButton variant="outline">描边</AkButton>
    <AkButton variant="ghost">幽灵</AkButton>
    <AkButton variant="danger" stripes>危险</AkButton>
    <AkButton variant="link">链接按钮</AkButton>
  </div>
</template>
