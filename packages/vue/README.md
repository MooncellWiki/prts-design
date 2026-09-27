# @mooncellwiki/akds-vue

AKDS（明日方舟网页设计系统）的 Vue 3 实现，≈ primer/react。组件输出与 CSS 实现相同的 `.ak-*` 结构，自带状态（`v-model`）、键盘操作与可访问性属性；**不带样式**——prts.wiki 页面上由皮肤（Skin:Arknights）提供；CSS 实现不发 npm（带不可转授的字体与游戏素材）。

```ts
import { AkButton, AkTabPane, AkTabs } from "@mooncellwiki/akds-vue";
```

API 参考 Naive UI（主状态统一用默认 `v-model`，外观用 `variant`，`label` 只作可访问名）。游戏素材（道具图、头像）的地址由调用方传入。

许可：MIT。

文档：https://mooncellwiki.github.io/prts-design/guide/vue · Storybook：https://mooncellwiki.github.io/prts-design/storybook/
