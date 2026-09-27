<script setup lang="ts">
import AkField from "../../Field/AkField.vue";
import AkSearch from "../AkSearch.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3 ak-max-narrow">
    <AkSearch size="sm" placeholder="筛选干员：名称 / 代号 / 拼音" label="筛选干员" />
    <AkSearch placeholder="搜索道具" label="搜索道具" />
    <AkSearch size="lg" placeholder="搜索关卡，如 1-7、CE-6" label="搜索关卡" />
    <AkField label="敌人" feedback="支持中文名与编号（如 B1）">
      <AkSearch placeholder="搜索敌人" />
    </AkField>
  </div>
</template>
