<script setup lang="ts">
import { ref } from "vue";

import AkCollapse from "../AkCollapse.vue";
import AkCollapseItem from "../AkCollapseItem.vue";

const expanded = ref(["akds"]);
</script>

<template>
  <div>
    <AkCollapse v-model="expanded">
      <AkCollapseItem name="akds" title="什么是 AKDS？">
        <p>明日方舟网页设计系统，为 prts.wiki 皮肤设计。</p>
      </AkCollapseItem>
      <AkCollapseItem name="codex" title="为什么不用 Codex 默认外观？">
        <p>Codex 令牌被桥接到 <code>--ak-*</code>，核心 / 扩展 UI 自动跟随；但视觉语言完全按明日方舟本体重建，而不是套一层配色。</p>
      </AkCollapseItem>
    </AkCollapse>
    <p class="ak-fs-sm ak-fg-muted ak-mb-0">v-model = {{ JSON.stringify(expanded) }}</p>
  </div>
</template>
