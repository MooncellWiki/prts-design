<script setup lang="ts">
import { ref } from "vue";

import AkRadio from "../AkRadio.vue";
import AkRadioGroup from "../AkRadioGroup.vue";

const position = ref("any");
const mod = ref("x");
</script>

<template>
  <div class="ak-flex-col ak-gap-6">
    <AkRadioGroup v-model="position" label="部署位置">
      <AkRadio value="any">不限</AkRadio>
      <AkRadio value="melee">近战位</AkRadio>
      <AkRadio value="ranged">远程位</AkRadio>
    </AkRadioGroup>
    <AkRadioGroup v-model="mod" label="模组" vertical size="sm">
      <AkRadio value="">陈证章（原型）</AkRadio>
      <AkRadio value="x">罗德岛制式剑 · SWO-X</AkRadio>
      <AkRadio value="y" disabled>往昔时光 · SWO-Y（未解锁）</AkRadio>
    </AkRadioGroup>
  </div>
</template>
