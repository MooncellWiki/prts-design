<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 搜索面板

参考 Citizen 的 Command Palette（starcitizen.tools）：搜索不是页眉里的一条输入框，而是一块**居中悬浮的「终端窗口」**——直角、顶部 3px 青条、56px 输入行、`--ak-bg-overlay` 遮罩 + 2px 模糊。不做 Vector 式的页眉内下拉建议：页眉是玻璃底，下拉在毛玻璃上叠层次会脏；居中面板用一层遮罩把注意力收拢，也天然适配手机（8px 边距的全宽卡片）。

核心 `packages/css/src/search-palette.js`（皮肤与预览共用，纯 DOM，不引 Vue / Codex）；样式 `chrome/search-palette.css`；页眉里的触发器在 `chrome/header.css`。

<SkinFrame :height="640" state="palette" caption="空查询：最近访问 + 快捷入口（取侧栏「通用」组前几项）" />

<SkinFrame :height="640" state="palette" query="yh" caption="输入 yh：本地即时索引按拼音首字母整词命中「银灰」（精确命中 → 预先高亮），结果带头像 / 职业 / 稀有度；末尾固定一行「全文搜索」" />

## 渐进增强

mustache 先渲染真表单 `form.ak-header__search#searchform > #searchInput`，无 JS 时直接提交到 `Special:Search`。脚本到位后：

1. 把表单换成 `button.ak-search-trigger`——长得像输入框的按钮（`aria-haspopup="dialog"`、`aria-keyshortcuts`），点击 / 聚焦回车打开面板；
2. 把**同一个** `<form>` 搬进面板顶部——`id` / `action` / hidden `title` / `#searchInput` 全保留，依赖 `#searchform #searchInput` 的 Gadget 不受影响，没有高亮项时回车仍是原生提交（= MW 的 Go：精确标题直达，否则全文结果页）；
3. 接管 `/`、Ctrl / ⌘ K、accesskey F。

## 交互

| 键 | 行为 |
|---|---|
| `/` · Ctrl / ⌘ K | 打开 |
| `↑` / `↓` | 循环高亮；高亮行 = 左 2px 青条 + 淡青底（同侧栏当前项） |
| `↵` | 有高亮项 → 打开它；没有 → Go（精确标题直达，否则全文结果页） |
| `⇧` `↵` | 全文搜索 |
| `Esc` | 有字先清空，再按关闭 |
| `/` 开头 · `>` `#` `@` `~` | 命令列表 · 进入模式（动作 / 分类 / 用户 / 文件），模式标签是主色实底的矩形 chip |

**标题搜索不默认高亮第一条**——和旧 Vector 的建议下拉一样，回车去哪只取决于输入的字，而不是建议怎么排序、到没到：打「陈」回车不会因为第一条建议是「陈晖洁」就被带走，也不会在新结果到达前打开旧列表里的某一行（继续输入会立刻清掉高亮）。只有**精确命中**才预先高亮：某一行的标题（或命中的重定向 `matched`）与输入相同，或数据源给它标了 `exact: true`（本地索引的别名 / 拼音首字母整词命中，如 `yh` → 银灰）——这时回车打开的就是 Go 会去的那一页，高亮只是把去向提前亮出来。页脚的 `↵` 提示随之在「打开」与「前往」之间切换。命令列表与模式（动作 / 分类 / 用户 / 文件）是选择器、没有「前往」可言，仍默认高亮第一条。

`⌘` / `Ctrl` `↵` 在新标签打开；模式里退格清空输入 / `←` / 返回键退出模式。打开的途径还有手机上页眉的图标按钮 `.ak-header__search-toggle` 与 accesskey F；关闭还有点遮罩、关闭按钮、选中结果。空查询时是最近访问（`localStorage['akds-recent']`，最多 8 条，只存标题 / 地址 / 描述 / 缩略图）+ 提示 + 快捷入口（取侧栏首个门户 `#p-navigation`）。行内动作只给最近访问一个「移除 ×」（始终占位、高亮时才显形，右侧元数据不跳）；**不放** Citizen 那种每行「编辑」——面板里唯一的主动作是「打开」。

触屏不显示键位提示；≤639 面板贴边 8px、「Esc」换成文字「取消」、结果行省掉类型标签与英文副标。

### 可访问性

- 面板 `role="dialog"` + `aria-modal`；输入框 `role="combobox"`，焦点始终留在输入框里，高亮项经 `aria-activedescendant` 播报；结果条数由 `aria-live` 区域念出。
- `Tab` 在面板内循环；关闭后焦点回到触发器。
- 触发器是 `<button>`，带 `aria-haspopup="dialog"` 与 `aria-keyshortcuts`。

状态类：`.has-query`（有字）· `.has-mode`（在模式里）· `.is-loading`（结果在路上）· `.is-closing`（关闭动画）。

## 在 MediaWiki 里

MW 侧的数据源是 `skin/resources/search-providers.js`（与核心同在 `skins.akds.js` 模块里），预览用 `preview/search-mock.js`。数据源 `search(q, signal)` 返回分组 `{ id, label, en, items }[]`：

| 层 | 来源 | 说明 |
|---|---|---|
| 标题搜索 | `GET /rest.php/v1/search/title?q=&limit=10` | 与 Vector 2022 / Citizen 相同；缩略图要 PageImages、描述要 ShortDescription / Description2（PRTS 可用 <code v-pre>{{SHORTDESC:…}}</code> 补）；`matched_title` 只在「别名式重定向」时显示，同时作为 `matched` 交给核心判断精确命中 |
| 本地即时索引（可选） | `mw.hook('akds.search.local').fire(fn)` 注入 `fn(q) → Group[]`（Skin:Arknights：`mw.hook('skin.arknights.search')`） | 干员 / 道具 / 关卡 JSON（Cargo 定时导出到 `MediaWiki:*.json`，或 API 缓存到 IndexedDB），支持拼音首字母 / 别名、0 网络等待，还能给结构化元数据（职业图标、稀有度）——预览里 `yh` → 银灰、`nts` → 能天使演示的就是这一层 |
| `>` 动作 | 本页菜单 `#p-views #p-cactions #p-tb #p-personal` + 常用特殊页面 | 同 Citizen「从页面菜单拉动作」 |
| `#` 分类 | 空查询：本页所属分类（`prop=categories`）；有字：`list=prefixsearch&psnamespace=14` | |
| `@` 用户 · `~` 文件 | `list=allusers&auprefix=` · `generator=prefixsearch&gpsnamespace=6&prop=pageimages` | |
| 兜底 | `Special:Search?search=q&go=Go` / `…&fulltext=1` | 没有高亮项时回车 → Go；`⇧` `↵` 与末尾固定行 → 全文 |

::: warning 核心的 searchSuggest 要关掉
核心的 `mediawiki.page.ready` 会在搜索框**聚焦时**懒加载 `mediawiki.searchSuggest`，它在 `#searchInput` 上挂旧式建议下拉——面板把这个输入框搬进了自己里面，不关掉就会在面板里再画一份列表。和 Vector 2022 一样，在 `SkinPageReadyConfig` 钩子里把 `search` 开关置 `false`（Skin:Arknights 的 `SkinHooks::onSkinPageReadyConfig()`，只在面板开启时）。**不是** `Skin::getDefaultModules()`：1.43 里那里的 `search` 组本来就是空的，覆盖它没有效果。退而求其次可以在 `search-providers.js` 里检测到 `mediawiki.searchSuggest` 时把 `#searchInput` 的 `id` 换掉，但那样依赖 `#searchInput` 的 Gadget 就不兼容了。
:::

- **开关**：`$wgAKDSSearchPalette = false` 关掉面板、保留原表单（要让 JS 读到，需在 `ResourceLoaderGetConfigVars` 钩子里输出 `wgAKDSSearchPalette`）。文案全部走 `akds-search-*` 消息（i18n 已含 zh-hans / en）。Skin:Arknights 里对应 `$wgArknightsSearchPalette`、`arknights-search-*` 消息；本地索引的钩子叫 `mw.hook('skin.arknights.search')`，最近访问存 `localStorage['arknights-search-recent']`，面板整包拆成 `skins.arknights.search` 模块按需加载（悬停预取、聚焦 / 按键时加载并打开），空态的快捷入口由 `MediaWiki:Arknights-search-shortcuts` 决定，`$wgArknightsSearchIndex` 把 Cargo 表做成带服务端拼音的本地索引——细节见其 README「搜索」一节。
- **体积**：`search-palette.js` ≈ 35KB 未压缩（含注释；gzip ≈ 11KB），可以拆成独立 RL 模块，在触发器 hover / focus 时 `mw.loader.using` 预取（Citizen 的做法）。
- **待办**：`/ns:` 命名空间模式（REST 标题搜索本身支持 `模板:xx` 前缀，优先级低）；Related（RelatedArticles）；Cargo 查询模式；拆模块做 intent prefetch。

<SkinFrame :width="390" :height="720" state="palette" query="陈" caption="390：手机上页眉的搜索收成图标，面板是全宽卡片" />

## 结构

由 JS 生成，类名即契约：

```
.ak-palette-backdrop
.ak-palette[role=dialog]
  __head    [__back] __icon [__chip] form.__form > input#searchInput  [__clear] __close  __loading
  __body > __viewport > __list[role=listbox] > __group[role=group] > __label + __item[role=option] > __link( __thumb __text( __title __desc ) __meta ) + __actions
                      | __empty( __empty-title __empty-desc __shortcuts )
  __foot    __foot-left  __hints > span > kbd.ak-kbd
```

## CSS

<CssClasses :files="['chrome/search-palette.css']" />

<CssSelectors :files="['chrome/search-palette.css']" />
