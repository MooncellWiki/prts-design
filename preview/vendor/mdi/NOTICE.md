# Material Design Icons（子集）

`materialdesignicons-subset.woff2` / `mdi.css` 取自 npm 包 [@mdi/font@7.4.47](https://www.npmjs.com/package/@mdi/font/v/7.4.47)（即现网 prts.wiki 从 `static.prts.wiki/mdi/7.4.47` 加载的那一版），由 `scripts/fetch-mdi.py` 生成：字体用 fontTools 只留样例页用到的图标（mdi-help-circle-outline），CSS 只留 `@font-face`、`.mdi:before` 基础规则和这几个图标。

- 按包里的 Pictogrammers Free License 授权（见同目录 `LICENSE`）：字体与图标按 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)，版权归 Pictogrammers 及各图标作者，不在本仓库 MIT 许可范围内。
- 给预览站的样例页用（现网 `{{mdi}}` / `{{Popup}}` 输出的 `<span class="mdi mdi-…">`）。
- 重抓：`python3 scripts/fetch-mdi.py`（样例页用了新图标就重跑）。
