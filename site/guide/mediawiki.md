# 在 MediaWiki 中使用

皮肤 `skin/`（AKDS）通过 ResourceLoader 加载全部 CSS；模板、TemplateStyles、Widget 只需要**输出约定好的结构**，不用自己带组件样式。

## 皮肤怎么加载样式

`skin/skin.json` 里三个样式模块，顺序固定：

| 模块 | 文件 |
|---|---|
| `skins.akds.fonts` | `fonts.css`（自托管字体，可整体关掉） |
| `skins.akds.tokens` | `tokens.css`（生成物）+ `base/root.css`（html / body 基底） |
| `skins.akds.styles` | `base/*` → `components/*` → `decor/*` → `arknights/*` → `chrome/*` → `utilities.css` |

ResourceLoader 把一个模块的文件拼成一张样式表，不跟 `@import`，所以 skin.json 逐文件列出。**顺序只有一个来源**：`src/index.css` 与各层 `index.css` 的 `@import` 顺序；改了之后跑

```sh
node scripts/css-order.ts --write   # 同步进 skin/skin.json；不带 --write 是检查（CI 用）
```

`skin/resources/` 下是指向 `src/` 各目录的符号链接，部署时把 `skin/` 拷到 `skins/AKDS/`，`wfLoadSkin('AKDS')`。

## 模板里怎么写

组件就是一段约定好的 HTML + 类名。每个组件页的示例都有「HTML」页签——那是 Vue 实现实际渲染出的结构，模板 / Lua 照着输出即可：

```html
<div class="ak-cbox ak-cbox--tip">
  <span class="ak-cbox__icon"><svg class="ak-icon" viewBox="0 0 24 24">…</svg></span>
  <div class="ak-cbox__body">如需了解<b>所有干员的上线时间</b>，可查阅<a href="…">干员上线时间一览</a>页面。</div>
</div>
```

- 令牌在 TemplateStyles 里可以直接引用：`color: var(--ak-accent)`。
- 模板输出的最外层标 `ak-not-prose`，子树就不受正文排版（标题色条、列表方块符、链接色）影响——整块是链接的组件尤其需要。见[设计理念 · prose / not-prose](/foundations/principles#prose-not-prose)。
- 现网已有的模板（如 `Template:Cbox2`、`Template:道具图标`）在对应组件页头有链接，改造时参照组件页的「HTML」结构。

完整的皮肤接入说明（skin.json、mustache 结构、clientPrefs 主题、Codex 桥接、迁移路线）见[参考 · 03 MediaWiki 接入](/reference/mediawiki-integration)。
