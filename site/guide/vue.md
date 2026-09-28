# 在 Vue / prts-widgets 中使用

`packages/vue/` 是 AKDS 的 Vue 3 实现（npm 包 `@mooncellwiki/akds-vue`）：组件输出与 CSS 实现相同的 `.ak-*` 结构，自带状态（`v-model`）、键盘操作与可访问性属性。

::: warning 实验阶段
Vue 实现全部处于「实验」状态，API 可能调整。
:::

## 样式从哪来

组件**不打包 CSS**，样式按宿主从不同地方来；三种宿主上看起来一样。组件放在「作用域根」里——`<AkScope>`（= `class="ak-scope"`）——才有排版基线（字体 / 字号 / 行高 / 前景色），不靠宿主页面的 `<body>`，见[作用域](/components/scope)：

| 宿主 | 样式来源 | 作用域 | 主题 |
|---|---|---|---|
| prts.wiki · AKDS 皮肤 | 皮肤已加载全套，什么都不用做 | `body.skin-akds`（包不包 `<AkScope>` 都一样） | 跟皮肤 |
| prts.wiki · 其它皮肤（Vector 2022 …） | widget 挂载前 `await mw.loader.using(["skins.akds.components"])`（需要官网字体再加 `"skins.akds.fonts"`）；AKDS 皮肤上这行是空操作 | 根节点 `<AkScope>` 或 `class="ak-scope"` | 跟 clientpref 类；或 `<AkScope theme>` 强制 |
| 站外 | `import "@mooncellwiki/akds-css"`（= `standalone.css`）；图片 / 素材 URL 由调用方传 props；想要道具底框自己覆盖 `--ak-item-bg-*` | 同上 | `html[data-theme]` 或 `<AkScope theme>`；不设则跟随系统 |

```vue
<script setup lang="ts">
import "@mooncellwiki/akds-css"; // 站外；prts.wiki 上改成挂载前 await mw.loader.using(["skins.akds.components"])
import { AkButton, AkScope } from "@mooncellwiki/akds-vue";
</script>

<template>
  <AkScope>
    <AkButton variant="primary">开始行动</AkButton>
  </AkScope>
</template>
```

- `skins.akds.components` 自带令牌与作用域根（`tokens.css` + `scope.css`），一个模块就齐；皮肤装上就能用，不需要 Gadget 再复制一份。它不写 `dependencies`——那样的模块进不了 AKDS 皮肤的 `styles`，见[模块与层序](/guide/resourceloader#resourceloader-模块)。
- 作用域在别的宿主上还会把宿主的页面环境换成 AKDS 皮肤上组件看到的那一套：宿主往下传的文字属性回到初始值；宿主对 `h1`–`h6` / `p` / 列表 / `img` / `code` 等元素的规则在组件元素和 `ak-not-prose` 子树里退回浏览器默认；裸 `<button>` / `<input>` / 勾选框的外观与皮肤一致；整块是链接的组件不被染成链接色。`scripts/verify/styles.ts hosts` 逐元素核过三种宿主一致（见[贡献一个组件 · 改 CSS 之后](/guide/contributing#改-css-之后)）。
- 组件里夹的**正文内容**（不带 `ak-` 类、不在 not-prose 里的段落 / 列表 / 链接）跟着宿主自己的正文排版走——MW 正文排版（`base/`）不随包走。

**哪些东西不随包走**：字体（`fonts.css` + `fonts/`，Novecento / Bender 不可转授；站外退到令牌里 Oswald / Chakra Petch / 系统字的回退链）· 游戏素材 `img/`（`.ak-item--bare` 的稀有度底框经 `base/skin-assets.css` 的 `--ak-item-bg-1…6` 取，站外没有底框）· Codex 桥接 `bridge-codex.css`（加载到别的皮肤上会改掉宿主自己的 Codex 配色）· `base/`（MW 正文排版；在 npm 包里，别的 MediaWiki 站想用可以自己 import）· `chrome/`（皮肤骨架）。

仓库内的 Storybook / 文档站引的是皮肤全套 `packages/css/src/index.css`；Storybook 工具栏的「宿主」可以切到 Vector 2022 / 站外，看同一个组件在别的宿主上的样子。

## 用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { AkButton, AkTabPane, AkTabs } from "@mooncellwiki/akds-vue";

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
