# mc-tooltips 脚本

`Tooltip.js` 是现网（prts.wiki）加载的 `https://static.prts.wiki/widgets/production/Tooltip.js`，即 [MooncellWiki/prts-widgets](https://github.com/MooncellWiki/prts-widgets) 的 `src/entries/Tooltip.ts` 打包后的产物，2026-10-17 由 `scripts/fetch-tooltip.ts` 抓取（SHA-256 `afb15e57c0882d4ca6cd54f5202eb73048b2d3b8b31c583470e712dbadfd79ff`）。唯一的改动是整个文件包进一个立即执行的函数、去掉 sourceMappingURL（样例页用普通 `<script>` 加载）。

- prts-widgets 按 [MIT](https://github.com/MooncellWiki/prts-widgets/blob/main/LICENSE) 授权；打包进去的 [tippy.js](https://github.com/atomiks/tippyjs)、[Popper](https://github.com/floating-ui/floating-ui/tree/v2.x) 也都是 MIT。
- 只给敌人页样例 `preview/enemy*.html` 的悬停说明用（`.mc-tooltips`，同现网 `{{Popup}}` / `{{术语}}` 的输出）。
- 重抓：`node scripts/fetch-tooltip.ts`（现网换了脚本就重跑）。
