<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkSpinner from "../AkSpinner.vue";

const loading = ref(true);
</script>

<template>
  <div class="ak-flex-col ak-gap-3 ak-items-start">
    <AkButton size="sm" @click="loading = !loading">{{ loading ? "加载完成" : "重新加载" }}</AkButton>
    <AkSpinner :show="loading" description="正在计算属性…" class="ak-w-full">
      <table class="wikitable ak-w-full ak-m-0">
        <thead>
          <tr><th>精英阶段</th><th>生命上限</th><th>攻击</th><th>防御</th><th>法术抗性</th></tr>
        </thead>
        <tbody>
          <tr><td>精英零 50 级</td><td>1684</td><td>361</td><td>221</td><td>0</td></tr>
          <tr><td>精英一 80 级</td><td>2188</td><td>469</td><td>288</td><td>0</td></tr>
          <tr><td>精英二 90 级</td><td>2880</td><td>610</td><td>352</td><td>0</td></tr>
        </tbody>
      </table>
    </AkSpinner>
  </div>
</template>
