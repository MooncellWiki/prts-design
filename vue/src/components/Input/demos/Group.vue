<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkInput from "../AkInput.vue";
import AkInputGroup from "../AkInputGroup.vue";

const page = ref("陈");
const trust = ref("200");
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <AkInputGroup>
      <AkInput v-model="page" label="页面名">
        <template #prefix>wiki/</template>
      </AkInput>
      <AkButton variant="primary">GO</AkButton>
    </AkInputGroup>
    <AkInput v-model="trust" label="信赖">
      <template #prefix>信赖</template>
      <template #suffix>%</template>
    </AkInput>
    <AkInputGroup size="sm">
      <AkInput label="筛选干员" placeholder="干员名 / 代号" />
      <AkButton icon="search" label="搜索" />
    </AkInputGroup>
  </div>
</template>
