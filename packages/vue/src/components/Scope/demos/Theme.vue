<script setup lang="ts">
import AkButton from "../../Button/AkButton.vue";
import AkCard from "../../Card/AkCard.vue";
import AkTag from "../../Tag/AkTag.vue";
import AkScope from "../AkScope.vue";
</script>

<template>
  <div class="ak-grid-2 ak-gap-4">
    <AkScope theme="dark" class="ak-p-4">
      <AkCard eyebrow="Terminal" title="终端模式" accent="top">
        <p class="ak-fs-sm ak-fg-2 ak-mb-0">theme="dark"：这一块走暗色令牌，不管页面是什么主题。</p>
        <template #footer>
          <AkTag size="sm" variant="accent-soft">局部主题</AkTag>
          <span class="ak-grow" />
          <AkButton size="sm" variant="primary">确认</AkButton>
        </template>
      </AkCard>
    </AkScope>
    <AkScope theme="light" class="ak-p-4">
      <AkCard eyebrow="Archive" title="档案模式" accent="top">
        <p class="ak-fs-sm ak-fg-2 ak-mb-0">theme="light"：这一块走亮色令牌，画布底色一起换。</p>
        <template #footer>
          <AkTag size="sm" variant="accent-soft">局部主题</AkTag>
          <span class="ak-grow" />
          <AkButton size="sm" variant="primary">确认</AkButton>
        </template>
      </AkCard>
    </AkScope>
  </div>
</template>
