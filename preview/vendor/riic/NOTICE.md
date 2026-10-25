# 后勤技能数据快照

`data.js` 是游戏数据（torappu 解包的 gamedata `26-10-14-13-45-10-99469376`：`excel/building_data.json` 的 buffs / chars / rooms / buffSortData、
`excel/character_table.json` 的干员名 / 稀有度 / 职业、`excel/gamedata_const.json` 的术语表与富文本样式）整理成的快照，
2026-10-25 由 `scripts/build-riic-data.py` 生成，共 763 条技能、432 位干员。

- 游戏数据版权归鹰角网络所有，不在本仓库 MIT 许可范围内。
- 只给整页样例 `preview/riic.html` 用；技能图标与头像不入库，页面运行时从 `torappu.prts.wiki` 取。
- 重新生成：`python3 scripts/build-riic-data.py --gamedata <gamedata 目录>`。
