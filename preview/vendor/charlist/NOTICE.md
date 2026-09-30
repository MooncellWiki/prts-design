# 干员一览数据快照

`data.js` 是 prts.wiki 现网[干员一览](https://prts.wiki/w/%E5%B9%B2%E5%91%98%E4%B8%80%E8%A7%88)页面正文里的两块数据（`#filter-filter` 筛选项定义、`#filter-data` 每位干员一条），2026-09-30 由 `scripts/fetch-charlist.ts` 抓取，共 431 位干员。

- 文本内容（干员名称、特性描述等）来自 prts.wiki，按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 使用；游戏数据版权归鹰角网络所有。不在本仓库 MIT 许可范围内。
- 只给整页样例 `preview/operators.html` 用；头像 / 半身像不入库，页面运行时从 `media.prts.wiki` 取。
- 重抓：`node scripts/fetch-charlist.ts`（用本机的 Google Chrome，原因见脚本头注释）。
