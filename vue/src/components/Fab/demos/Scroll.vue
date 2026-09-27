<script setup lang="ts">
import { ref, useTemplateRef } from "vue";

import AkBackTop from "../AkBackTop.vue";

const chapters = ["黑暗时代·上", "黑暗时代·下", "异卵同生", "二次呼吸", "急性衰竭", "靶向药物", "局部坏死", "苦难摇篮", "怒号光明", "风暴瞭望", "破碎日冕", "淬火尘霾"];
const box = useTemplateRef<HTMLElement>("box");
const shown = ref(false);
</script>

<template>
  <div>
    <!-- 示例用的定高滚动区域（高度是示例脚手架，不属于组件） -->
    <div class="ak-relative ak-border">
      <div ref="box" class="ak-overflow-auto ak-p-4" style="height: 200px">
        <p>往下滚动这个区域，超过 120px 后右下角出现「回到顶部」。</p>
        <ul>
          <li v-for="(c, i) in chapters" :key="c">{{ i === 0 ? "序章" : `第 ${i} 章` }}　{{ c }}</li>
        </ul>
      </div>
      <AkBackTop v-model="shown" position="absolute" :listen-to="box" :visibility-height="120" />
    </div>
    <p class="ak-fs-sm ak-fg-muted ak-mt-2 ak-mb-0">v-model = {{ shown }}</p>
  </div>
</template>
