# 敌人一览数据快照

`data.js` 是 prts.wiki 现网[敌人一览](https://prts.wiki/w/%E6%95%8C%E4%BA%BA%E4%B8%80%E8%A7%88)页面的 Widget（prts-widgets 的 `EnemiesListV2`）运行时取的那份 JSON（[敌人一览/数据](https://prts.wiki/w/%E6%95%8C%E4%BA%BA%E4%B8%80%E8%A7%88/%E6%95%B0%E6%8D%AE)：每个敌人的图鉴编号 / 名称 / 地位 / 种类 / 攻击方式 / 伤害类型 / 行动方式 / 八项属性的等级 / 能力），2026-10-04 由 `scripts/fetch-enemies.ts` 抓取，共 1710 个敌人。

- 文本内容（敌人名称、能力描述等）来自 prts.wiki，按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 使用；游戏数据版权归鹰角网络所有。不在本仓库 MIT 许可范围内。
- 只给整页样例 `preview/enemies.html` 用；头像不入库，页面运行时从 `media.prts.wiki` 取。
- 重抓：`node scripts/fetch-enemies.ts`（用本机的 Google Chrome，原因见脚本头注释）。
