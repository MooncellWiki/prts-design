# 在纯 HTML 中使用

不用打包器、不用 Vue，也不在 MediaWiki 里：静态页面、后端模板、CodePen 这类环境，引一张样式表，再照组件文档「HTML」页签里的结构写就行，和 [Primer CSS](https://primer.style/css/) 的用法一样。组件就是**一段约定好的 HTML 结构加上类名**，外观和主题由样式表负责。

## 引入样式

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mooncellwiki/prts-design-css@0.1/dist/prts-design.min.css">
```

- `dist/prts-design.min.css` 是单文件版：`src/standalone.css` 的全部 `@import` 已内联（≈ 120 KB，gzip 后 ≈ 22 KB）。同目录的 `prts-design.css` 是不压缩的同一份，保留了各文件的头注释，查某条规则来自哪个组件时用。
- unpkg 也能用：`https://unpkg.com/@mooncellwiki/prts-design-css@0.1/dist/prts-design.min.css`。
- **锁版本**：0.x 阶段次版本号之间可能不兼容，写 `@0.1`（只接收 0.1.x 的修复）或完整版本号，别写 `@latest`。
- jsDelivr / unpkg 在国内访问不稳定，正式站点建议自托管，见下一节。

### npm

```sh
pnpm add @mooncellwiki/prts-design-css
```

- 有打包器（Vite / webpack …）：`import "@mooncellwiki/prts-design-css";`，入口是 `src/standalone.css`，`@import` 由打包器展开。
- 没有打包器、要自托管：把 `node_modules/@mooncellwiki/prts-design-css/dist/prts-design.min.css` 拷到自己的静态目录。

以上几种方式的内容相同，都是 `standalone.css`：令牌 → 作用域根 → 通用组件 → 方舟组件 → 工具类 → 强制色模式。在 Vue 里用组件见[在 Vue / prts-widgets 中使用](/guide/vue)。

## 起步模板

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PRTS Design</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mooncellwiki/prts-design-css@0.1/dist/prts-design.min.css">
  <style>
    body { margin: 0; background: var(--ak-bg-canvas); }
  </style>
</head>
<body class="ak-scope">
  <main class="ak-flex ak-flex-col ak-gap-4" style="max-width: 720px; margin: 0 auto; padding: 32px 16px;">
    <div class="ak-heading ak-heading--underline">
      <h2 class="ak-heading__title">作战记录</h2>
      <span class="ak-heading__en" lang="en">OPERATION LOG</span>
    </div>
    <div class="ak-flex ak-wrap ak-items-center ak-gap-2">
      <button type="button" class="ak-btn ak-btn--primary">开始行动</button>
      <button type="button" class="ak-btn">编辑编队</button>
      <span class="ak-tag ak-tag--accent">近卫</span>
      <span class="ak-tag ak-tag--new">NEW</span>
    </div>
  </main>
</body>
</html>
```

有三点要注意：

1. **`class="ak-scope"` 是作用域根**：组件的字体、字号、行高、前景色都挂在它上面，不靠 `<body>` 继承。放在 `<body>` 上就是整页可用；嵌进一个已有的网站时，只放在要用组件的那一块的根节点上，页面其余部分不受影响。见[作用域](/components/scope)。
2. **页面底色要自己设**：单文件版不带 `html` / `body` 的全局样式（那部分是 Arknights 皮肤的 `base/`），用令牌写：`background: var(--ak-bg-canvas)`，主题切换时会跟着变。
3. **结构照抄组件文档**：每个组件页示例下面的「HTML」页签就是 Vue 组件实际渲染出的结构，类名和层级照着写，效果一样。

模板里 `<main>` 的内容渲染出来是这样（切换本站右上角的外观开关可以看两套主题）：

```html demo bare
<div class="ak-flex ak-flex-col ak-gap-4">
  <div class="ak-heading ak-heading--underline">
    <h2 class="ak-heading__title">作战记录</h2>
    <span class="ak-heading__en" lang="en">OPERATION LOG</span>
  </div>
  <div class="ak-flex ak-wrap ak-items-center ak-gap-2">
    <button type="button" class="ak-btn ak-btn--primary">开始行动</button>
    <button type="button" class="ak-btn">编辑编队</button>
    <span class="ak-tag ak-tag--accent">近卫</span>
    <span class="ak-tag ak-tag--new">NEW</span>
  </div>
</div>
```

## 主题

| 写法 | 效果 |
|---|---|
| 什么都不写 | 跟随系统（`prefers-color-scheme`） |
| `<html data-theme="dark">` | 终端模式（暗） |
| `<html data-theme="light">` | 档案模式（亮） |
| `<div class="ak-scope" data-theme="dark">` | 只有这一块走终端配色，其余部分不变（局部主题，自带画布底色） |

要做一个外观开关，改 `<html>` 上的 `data-theme` 就可以。上次的选择在 `<head>` 里、样式表之前恢复，首屏不会先闪一下别的主题：

```html
<script>
  const saved = localStorage.getItem("ak-theme");
  if (saved) document.documentElement.dataset.theme = saved;

  /** theme：'dark' | 'light' | 'os'（跟随系统） */
  function setTheme(theme) {
    if (theme === "os") {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem("ak-theme");
    } else {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("ak-theme", theme);
    }
  }
</script>
```

`tokens.css` 会在根元素上设置 `color-scheme`，浏览器自带的滚动条和表单控件也会跟着切换。两套主题的令牌值见[色彩](/foundations/color)。

## 字体

包里**不含字体**：Novecento Sans Wide、Bender 是按与鹰角同一组织下的共用授权使用的，不能转授。什么字体都不加载也能用，令牌里的回退链会一路退到系统字（中文一般落到苹方 / 微软雅黑）。想让拉丁字形更接近 Arknights 皮肤，可以加载回退链里的开源字体（OFL），`font-family` 名要和令牌里写的一致：

| 令牌 | 用在哪 | 开源替补 |
|---|---|---|
| `--ak-font-display` | 拉丁展示字：大写标题、英文副标 | `"Oswald"` |
| `--ak-font-label` | HUD 标签、数值 | `"Chakra Petch"` |
| `--ak-font-mono` | 代码、键帽 | `"JetBrains Mono"` |
| `--ak-font-body` | 正文 | 系统中文字体即可；要统一字形再加 `"Noto Sans SC"` |

例如用 Google Fonts（国内访问不了时换镜像，或自托管字体文件）：

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@400..700&family=Chakra+Petch:wght@400;600;700&family=JetBrains+Mono:wght@400..700&display=swap">
```

也可以直接换成自己的字体：在样式表之后覆盖令牌，例如 `:root { --ak-font-display: "Your Display Font", sans-serif; }`。

## 图标

- 界面线稿图标用内联 SVG：`<svg class="ak-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">…</svg>`。在[图标](/foundations/icons)页把「点击复制」切到「内联 SVG」，点哪个就复制哪一段。
- 颜色跟文字色走（`currentColor`）。放在组件的图标位里（`.ak-btn__icon`、`.ak-message__icon` …）时尺寸由组件决定；单独使用时自己加 `width` / `height`。
- 旁边没有文字、图标本身有含义时，把 `aria-hidden="true"` 换成 `role="img" aria-label="…"`。
- 游戏图标（职业、精英化、道具 …）不在包里，图片地址自己提供。白色线稿类的图片加 `.ak-glyph`，亮色主题下会自动反相，见[装饰语言](/foundations/decoration#白色线稿图标-ak-glyph)。

## 需要交互的组件

样式表只负责外观，状态要你自己切换。CSS 认的是原生状态、ARIA 属性和 `is-*` 类：

| 组件 | CSS 看的状态 | 纯 HTML 的写法 |
|---|---|---|
| [折叠面板](/components/accordion) | `<details class="ak-details">` 的 `[open]` | 原生 `<details>`，不用写脚本 |
| [文字提示](/components/tooltip) | `[data-ak-tip]` 的 `:hover` / `:focus-visible` | `data-ak-tip="提示文字"`，不用写脚本 |
| [下拉菜单](/components/dropdown) | `.ak-dropdown > details[open]`，或 `.ak-dropdown.is-open` | 用 `<details>` 包菜单就不用写脚本；键盘导航要自己补 |
| [对话框](/components/dialog) | `<dialog class="ak-dialog">` 的 `[open]`；抽屉是 `.ak-drawer.is-open` | `dialog.showModal()` / `dialog.close()` |
| [标签页](/components/tabs) | `.ak-tab.is-active` + `aria-selected="true"`；面板 `.ak-tabpanel[hidden]` | 见下面的脚本 |
| [轻提示](/components/toast) | 由脚本插入 / 移除 | 自己写，或者改用 Vue 实现 |

标签页的结构和切换脚本（点击、`←` / `→`、`Home` / `End`，和 Vue 版的 `AkTabs` 一样是自动激活）：

```html
<div class="ak-tabs" role="tablist">
  <button type="button" role="tab" class="ak-tab is-active" aria-selected="true" aria-controls="p-skill" id="t-skill">技能</button>
  <button type="button" role="tab" class="ak-tab" aria-selected="false" aria-controls="p-talent" id="t-talent" tabindex="-1">天赋</button>
</div>
<div class="ak-tabpanel" role="tabpanel" id="p-skill" aria-labelledby="t-skill">赤霄·拔刀</div>
<div class="ak-tabpanel" role="tabpanel" id="p-talent" aria-labelledby="t-talent" hidden>锋刃</div>

<script>
  for (const list of document.querySelectorAll('.ak-tabs[role="tablist"]')) {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab) => {
      for (const t of tabs) {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      }
    };
    list.addEventListener("click", (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) select(tab);
    });
    list.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement);
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (i < 0 || to === undefined) return;
      e.preventDefault();
      const tab = tabs[(to + tabs.length) % tabs.length];
      select(tab);
      tab.focus();
    });
  }
</script>
```

交互多的页面（表单联动、弹层、筛选）直接用 [Vue 实现](/guide/vue)更省事：结构、状态、键盘和可访问性都已经做好，样式还是同一张表。

## 按需引入

只用少数几个组件、又在意体积时，可以按文件引入 `src/` 下的源文件，但**顺序必须和 `standalone.css` 一致**：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mooncellwiki/prts-design-css@0.1/src/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mooncellwiki/prts-design-css@0.1/src/scope.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mooncellwiki/prts-design-css@0.1/src/components/button.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mooncellwiki/prts-design-css@0.1/src/components/tag.css">
```

- `tokens.css` 和 `scope.css` 必须引，而且要放在最前面。组件之间的先后按 `src/components/index.css` 的顺序；方舟组件（`src/arknights/`）还依赖装饰语言 `src/decor/`；`components/keyframes.css` 是共用的动画。
- 每多一个文件就多一个请求，大多数情况下单文件版更合适（gzip 后只有 ≈ 22 KB）。

## 包里没有的

| 内容 | 说明 |
|---|---|
| 字体 | 见上文[字体](#字体) |
| 游戏素材 | `.ak-item--bare` 的稀有度底框读 `--ak-item-bg-1…6`，站外默认没有；需要的话在 `:root` 上覆盖这组变量，写图片的绝对地址 |
| MediaWiki 正文排版 `base/` | 裸 `h2` / `p` / `table` 这类元素的样式。纯 HTML 页面里的裸元素走浏览器默认或你自己的样式；`base/` 是按 MW 页面写的（会改 `html` / `body`），不在单文件里 |
| 皮肤骨架 `chrome/` | Arknights 皮肤的页眉、侧栏、页脚这些 |

## 和别的样式放在一起

- 类名都带 `ak-` 前缀，令牌都是 `--ak-*`，一般不会和宿主的类名、变量冲突。根元素上除了令牌只设了 `color-scheme`，不给 `html` / `body` / 裸元素写样式。例外有两类：游戏富文本的别名类 `.ba-*` / `.tu-imp`（对应游戏文本里的 `<@ba.vup>` 这类标签，会设颜色和字重）；`[data-rarity]` / `[data-prof]` 属性，只在元素上设 `--ak-*` 变量。
- 宿主对 `h1`–`h6` / `p` / 列表 / `img` / `code` 这类元素的全局规则，到了作用域里的组件元素上会退回浏览器默认；裸 `<button>` / `<input>` / 勾选框的外观和 Arknights 皮肤上一致。整块是链接的组件（`a.ak-card` …）要加 `ak-not-prose`，才不会被宿主的 `a` 规则染成链接色。详见[作用域 · 作用域里还有什么](/components/scope#作用域里还有什么)。
