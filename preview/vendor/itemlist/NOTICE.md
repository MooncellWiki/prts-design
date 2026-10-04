# 道具一览数据快照

`data.js` 是 prts.wiki 现网[道具一览](https://prts.wiki/w/%E9%81%93%E5%85%B7%E4%B8%80%E8%A7%88)页面正文里的那块数据（`#cargo-data`，每件道具一条），2026-10-04 由 `scripts/fetch-itemlist.ts` 抓取，共 1392 件道具。

- 文本内容（道具名称、用途、描述、获取途径等）来自 prts.wiki，按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 使用；游戏数据版权归鹰角网络所有。不在本仓库 MIT 许可范围内。
- 只给整页样例 `preview/items.html` 用；道具图标不入库，页面运行时从 `torappu.prts.wiki` / `media.prts.wiki` 取。
- 重抓：`node scripts/fetch-itemlist.ts`（用本机的 Google Chrome，原因见脚本头注释）。
