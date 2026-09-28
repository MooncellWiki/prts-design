# @mooncellwiki/akds-vue

AKDS（明日方舟网页设计系统）的 Vue 3 实现，≈ primer/react。组件输出与 CSS 实现相同的 `.ak-*` 结构，自带状态（`v-model`）、键盘操作与可访问性属性；**不带样式**，样式按宿主来：

| 宿主 | 样式 |
|---|---|
| prts.wiki · AKDS 皮肤（Skin:Arknights） | 皮肤已加载全套，直接用 |
| prts.wiki · 其它皮肤（Vector 2022 …） | 挂载前 `await mw.loader.using(["skins.akds.components"])`（AKDS 皮肤上是空操作） |
| 站外 | `import "@mooncellwiki/akds-css"`（可选 peer 依赖；不含字体与游戏素材） |

widget 的根节点包一层 `<AkScope>`（= `class="ak-scope"`）：排版基线挂在这里、不靠宿主的 body，三种宿主上看起来一样；`<AkScope theme="dark|light">` 让这一块局部固定走终端 / 档案配色。

```ts
import { AkButton, AkScope, AkTabPane, AkTabs } from "@mooncellwiki/akds-vue";
```

API 参考 Naive UI（主状态统一用默认 `v-model`，外观用 `variant`，`label` 只作可访问名）。游戏素材（道具图、头像）的地址由调用方传入。

许可：MIT。

文档：https://mooncellwiki.github.io/prts-design/guide/vue · Storybook：https://mooncellwiki.github.io/prts-design/storybook/
