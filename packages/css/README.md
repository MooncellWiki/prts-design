# @mooncellwiki/akds-css（不发布）

AKDS（明日方舟网页设计系统）的 CSS 实现，≈ primer/css——prts.wiki 皮肤 Skin:Arknights 加载的就是这份样式表（`skin/resources/` 下是指向这里的链接）。

**不发布到 npm**：包里带着字体（其中 Novecento Sans Wide、Bender 按与鹰角同一组织下的共用授权使用，不可转授）与游戏素材（`img/`）。样式表代码本身以仓库根目录的 MIT 授权；字体与素材不在其内，见各自目录的 NOTICE / LICENSE。

层：`tokens.css`（生成物，源在 `packages/tokens`）→ `base/`（MediaWiki 内容）→ `components/`（通用组件）→ `decor/` + `arknights/`（方舟组件）→ `chrome/`（皮肤骨架）→ `utilities.css` → `forced-colors.css`（只在强制色模式下生效）。各层 `index.css` 的 `@import` 顺序就是加载顺序；增删 / 调序后跑 `node scripts/css-order.ts --write` 同步 skin.json。

文档：https://mooncellwiki.github.io/prts-design/
