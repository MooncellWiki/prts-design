# Vector 2022 样式夹具

`vector.css` 是 prts.wiki 现网 Vector 2022 皮肤（及同页加载的几个扩展）经 ResourceLoader 输出的样式，`site.css` 是同站的 `site.styles`（MediaWiki:Common.css / Vector.css …），2026-09-28 由 `scripts/fetch-vector-css.ts` 抓取（MediaWiki 1.43.9）：

    https://prts.wiki/load.php?lang=zh-cn&modules=ext.cite.styles%7Cext.srf.styles%7Cext.uls.pt%7Cjquery.makeCollapsible.styles%7Cskins.vector.icons%7Cskins.vector.styles%7Cskins.vector.search.codex.styles&only=styles&skin=vector-2022
    https://prts.wiki/load.php?lang=zh-cn&modules=site.styles&only=styles&skin=vector-2022

**仅作跨宿主回归测试的夹具**（`preview/gallery.html?host=vector`、Storybook「宿主：Vector 2022」、`pnpm e2e --project=hosts`），不属于 AKDS；入库只为让测试不出网，不随文档站发布（`scripts/build-site.sh` 组装站点时删掉）。

许可：Vector 皮肤与 MediaWiki 核心样式为 GPL-2.0-or-later（https://www.mediawiki.org/wiki/Skin:Vector），各扩展按其各自的许可；站点自定义样式版权归 prts.wiki 的编者。
