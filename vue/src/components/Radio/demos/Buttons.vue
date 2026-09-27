<script setup lang="ts">
import { ref } from "vue";

import AkRadioButton from "../AkRadioButton.vue";
import AkRadioGroup from "../AkRadioGroup.vue";

const view = ref("grid");
const sort = ref("rarity");
const layout = ref("list");
</script>

<template>
  <div class="ak-flex-col ak-gap-4 ak-items-start">
    <AkRadioGroup v-model="view" label="视图">
      <AkRadioButton value="list" icon="list">列表</AkRadioButton>
      <AkRadioButton value="grid" icon="grid">网格</AkRadioButton>
      <AkRadioButton value="table" icon="table">表格</AkRadioButton>
    </AkRadioGroup>
    <AkRadioGroup v-model="sort" label="排序" size="sm">
      <AkRadioButton value="rarity">按稀有度</AkRadioButton>
      <AkRadioButton value="time">按实装时间</AkRadioButton>
      <AkRadioButton value="name">按名称</AkRadioButton>
      <AkRadioButton value="trust" disabled>按信赖</AkRadioButton>
    </AkRadioGroup>
    <AkRadioGroup v-model="layout" label="视图（图标）">
      <AkRadioButton value="list" icon="list" label="列表" />
      <AkRadioButton value="grid" icon="grid" label="网格" />
      <AkRadioButton value="table" icon="table" label="表格" />
    </AkRadioGroup>
  </div>
</template>
