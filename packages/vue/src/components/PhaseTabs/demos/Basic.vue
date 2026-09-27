<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkLevel from "../../Level/AkLevel.vue";
import AkTrust from "../../Trust/AkTrust.vue";
import AkPhaseTabs from "../AkPhaseTabs.vue";

const icons = [0, 1, 2].map(n => asset(`elite/elite_${n}.png`));
const phase = ref(2);

/** 陈：各阶段满级与满级攻击（现网 {{CharinfoV2}} 数据） */
const maxLv = [50, 80, 90];
const atk = [361, 469, 610];
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-3">
    <!-- 属性计算器的控制行：阶段选择器、LV 灰块、信赖同一条线（24px） -->
    <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
      <AkPhaseTabs v-model="phase" :icons="icons" />
      <AkLevel :value="maxLv[phase]" variant="badge" />
      <AkTrust :value="100" />
    </div>
    <p class="ak-mb-0 ak-fs-sm ak-fg-muted">精英 {{ phase }} 满级攻击：{{ atk[phase] }}</p>
  </div>
</template>
