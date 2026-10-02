# Spine 运行时

`spine-webgl.js` 是 [Spine Runtimes](https://github.com/EsotericSoftware/spine-runtimes) 3.8 的 spine-webgl，带 prts-widgets 的几处修补，2026-10-02 由 `scripts/fetch-spine.ts` 取自 [MooncellWiki/prts-widgets@c344ac9](https://github.com/MooncellWiki/prts-widgets/blob/c344ac92298240f03d7863fa2aa71b3867406699/src/spine/runtime/spine-webgl.js)——即现网 SpineViewer 打包的那一份。唯一的改动是结尾的 `export default spine` 换成 `window.spine = spine`（样例页用普通 `<script>` 加载）。

- 版权归 Esoteric Software 所有，按 [Spine Runtimes License](http://esotericsoftware.com/spine-runtimes-license) 使用，不在本仓库 MIT 许可范围内。
- 只给整页样例 `preview/operator.html` 的「干员模型」用；模型文件（.skel / .atlas / .png）不入库，页面运行时从 `torappu.prts.wiki` 取，版权归鹰角网络所有。
- 重抓：`node scripts/fetch-spine.ts`（上游改了运行时就改脚本里的 `COMMIT`）。
