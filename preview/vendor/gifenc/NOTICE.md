# gifenc

`gifenc.js` 是 [gifenc](https://github.com/mattdesl/gifenc) 1.0.3 的 `dist/gifenc.esm.js`，2026-10-03 由 `scripts/fetch-gifenc.ts` 取自 npm——与现网 SpineViewer（prts-widgets）导出 GIF 用的是同一个版本。唯一的改动是结尾的 `export{…}` 换成 `window.gifenc = {…}`、整个文件包进一个函数（样例页用普通 `<script>` 加载）。

- 只给整页样例 `preview/operator.html` 的「干员模型」导出 GIF 用，点了导出才加载。
- 重抓：`node scripts/fetch-gifenc.ts`（prts-widgets 升级了 gifenc 就改脚本里的 `VERSION`）。

## 许可

The MIT License (MIT)
Copyright (c) 2017 Matt DesLauriers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
