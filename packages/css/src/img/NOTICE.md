# src/img/ · CSS 直接引用的游戏素材

与 `src/fonts/` 一样跟着样式表走（`arknights/item.css` 里 `url("../img/…")` 相对样式表自身；皮肤的 `skin/resources/img` 是这里的符号链接，ResourceLoader 按模块文件位置改写 url）。页面级素材（图标、头像、立绘 …）仍在 `preview/assets/`。

| 文件 | 来源 | 用途 |
|---|---|---|
| `item/bg_1.png` … `item/bg_6.png`（183×183） | prts.wiki 文件:道具_背景_1.png … 道具_背景_6.png（2019-05-21 上传，= 游戏道具底图 sprite_item_r1–r6，一字未改；`scripts/fetch-item-bg.py` 钉 media.prts.wiki 路径抓取） | `.ak-item--bare[data-rarity=1–6]` 的稀有度底框（白 / 绿 / 蓝 / 紫 / 金 / 特殊），裸图标压在上面占 94%——`.ak-item` 默认直接用现网拼好的 道具_带框_*.png（preview/assets/item/framed/），这批只给手里没有合成图时用 |
| `ui/trust.png`（19×19） | prts.wiki 文件:图标_信赖.png（media.prts.wiki 原图，一字未改） | `.ak-trust` 前面的信赖图标，经 `base/skin-assets.css` 的 `--ak-trust-icon` 引用 |

游戏素材版权归鹰角网络所有；本仓库仅作 PRTS 皮肤设计用途。
