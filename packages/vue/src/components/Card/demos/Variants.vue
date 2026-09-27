<script setup lang="ts">
import AkCard from "../AkCard.vue";
</script>

<template>
  <div class="ak-grid ak-grid-2 ak-gap-4">
    <AkCard title="默认" eyebrow="Default">
      <p class="ak-fs-sm ak-fg-2 ak-mb-0">表面色 + 1px 边。</p>
    </AkCard>
    <AkCard title="平铺" eyebrow="Flat" variant="flat">
      <p class="ak-fs-sm ak-fg-2 ak-mb-0">无边、表面 2 底：卡片里再套一层时用。</p>
    </AkCard>
    <AkCard title="凹陷" eyebrow="Inset" variant="inset">
      <p class="ak-fs-sm ak-fg-2 ak-mb-0">凹陷底：数据块、代码示例的托盘。</p>
    </AkCard>
    <AkCard title="黑白为体，青为用" eyebrow="01 · Monochrome first" accent="top">
      <p class="ak-fs-sm ak-fg-2 ak-mb-0">顶部 3px 色条：与 1px 细框用 border-image 直角拼接，不斜接。</p>
    </AkCard>
    <AkCard title="左色条卡片" accent="left">
      <p class="ak-fs-sm ak-fg-2 ak-mb-0">用于公告、提示、天赋条目。</p>
    </AkCard>
    <AkCard title="悬停 + 选中" accent="left" hoverable selected>
      <p class="ak-fs-sm ak-fg-2 ak-mb-0">选中态 = 青色 1px 内描边 + 左上角三角角标（源自游戏内技能选中框）。</p>
    </AkCard>
  </div>
</template>
