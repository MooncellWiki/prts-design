<script setup lang="ts">
import { ref } from "vue";

import AkSlider from "../AkSlider.vue";

const level = ref(90);
const trust = ref(100);
const skill = ref(7);
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <div class="ak-flex ak-gap-3 ak-items-center">
      <span class="ak-overline ak-nowrap">等级</span>
      <AkSlider v-model="level" :min="1" :max="90" label="等级" />
      <span class="ak-num">{{ level }}</span>
    </div>
    <div class="ak-flex ak-gap-3 ak-items-center">
      <span class="ak-overline ak-nowrap">信赖</span>
      <AkSlider v-model="trust" :max="200" :step="10" label="信赖" :format-value="v => `${v}%`" />
      <span class="ak-num">{{ trust }}%</span>
    </div>
    <div class="ak-flex ak-gap-3 ak-items-center">
      <span class="ak-overline ak-nowrap">技能</span>
      <AkSlider v-model="skill" :min="1" :max="7" label="技能等级" disabled />
      <span class="ak-num">{{ skill }}</span>
    </div>
  </div>
</template>
