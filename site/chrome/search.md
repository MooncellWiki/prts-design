<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 搜索面板

参考 Citizen 的 Command Palette（starcitizen.tools）：搜索不是页眉里的一条输入框，而是一块**居中悬浮的「终端窗口」**——直角、顶部 3px 青条、56px 输入行、`--ak-bg-overlay` 遮罩 + 2px 模糊。不做 Vector 式的页眉内下拉建议：页眉是玻璃底，下拉在毛玻璃上叠层次会脏；居中面板用一层遮罩把注意力收拢，也天然适配手机（8px 边距的全宽卡片）。

核心 `src/search-palette.js`（皮肤与预览共用，纯 DOM，不引 Vue / Codex）；样式 `chrome/search-palette.css`；页眉里的触发器在 `chrome/header.css`。

<SkinFrame :height="640" state="palette" caption="空查询：最近访问 + 快捷入口（取侧栏「通用」组前几项）" />

<SkinFrame :height="640" state="palette" query="yh" caption="输入 yh：本地即时索引按拼音首字母命中「银灰」，结果带头像 / 职业 / 稀有度；末尾固定一行「全文搜索」" />

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
| `↵` | 打开高亮项；结果还没到时 → Go |
| `⇧` `↵` | 全文搜索 |
| `Esc` | 有字先清空，再按关闭 |
| `/` 开头 · `>` `#` `@` `~` | 命令列表 · 进入模式（动作 / 分类 / 用户 / 文件），模式标签是主色实底的矩形 chip |

触屏不显示键位提示；≤639 面板贴边 8px、「Esc」换成文字「取消」、结果行省掉类型标签与英文副标。数据源（REST 标题搜索、可选的本地即时索引、各模式的 API）见[参考 · 03 §3.3](/reference/mediawiki-integration)。

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
