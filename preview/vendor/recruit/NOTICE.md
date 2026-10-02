# 公招计算数据快照

`data.js` 是 prts.wiki 现网[公招计算](https://prts.wiki/w/%E5%85%AC%E6%8B%9B%E8%AE%A1%E7%AE%97)页面的 Widget（prts-widgets 的 `HrCalculator`）运行时发的那条 cargoquery 的结果（获得方式含「公开招募」的干员：职业 / 位置 / 稀有度 / 词缀 / 名称 / 获得方式），2026-10-02 由 `scripts/fetch-recruit.ts` 抓取，共 160 位干员。

- 文本内容（干员名称、词缀等）来自 prts.wiki，按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 使用；游戏数据版权归鹰角网络所有。不在本仓库 MIT 许可范围内。
- 只给整页样例 `preview/recruit.html` 用；头像不入库，页面运行时从 `media.prts.wiki` 取。
- 重抓：`node scripts/fetch-recruit.ts`（用本机的 Google Chrome，原因见脚本头注释）。
