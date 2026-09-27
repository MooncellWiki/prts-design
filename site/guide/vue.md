# 在 Vue / prts-widgets 中使用

`vue/` 是 AKDS 的 Vue 3 实现（`@akds/vue`）：组件输出与 CSS 实现相同的 `.ak-*` 结构，自带状态（`v-model`）、键盘操作与可访问性属性。

::: warning 实验阶段
Vue 实现全部处于「实验」状态，API 可能调整。目前还没有发布 npm 包，先在仓库里开发、在 Storybook 里走查。
:::

## 样式从哪来

组件**不打包 CSS**。在 wiki 页面上，皮肤已经加载了全部样式，Widget 里直接用组件即可；独立页面（本地开发、Storybook）自己引入一次：

```ts
import "prts-design/src/index.css";
```

## 用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { AkButton, AkTabPane, AkTabs } from "@akds/vue";

const tab = ref("skill");
</script>

<template>
  <AkTabs v-model="tab">
    <AkTabPane name="skill" tab="技能">…</AkTabPane>
    <AkTabPane name="module" tab="模组">…</AkTabPane>
  </AkTabs>
  <AkButton variant="primary" icon="edit">编辑</AkButton>
</template>
```

- 每个组件页的「Vue API」一节列出 props / 事件 / 插槽，数据直接来自组件的 TypeScript 类型与注释。
- 图标用 `<AkIcon name="search" />` 内联渲染，不依赖页面里的 SVG sprite。
- 游戏素材（道具图、头像）的地址由调用方传入——生产环境是 `media.prts.wiki` 的地址。

## 开发

```sh
pnpm install
pnpm storybook     # 组件工作台 :6006
pnpm dev:docs          # 本文档站
pnpm typecheck     # vue-tsc
```

新增组件的步骤见[贡献一个组件](/guide/contributing)。
