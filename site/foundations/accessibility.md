# 可访问性

整套系统的总则。各组件自己的键盘操作、ARIA 输出写在组件页的「可访问性」一节（或页签，如[按钮](/components/button/accessibility)）。

## 对比度

| 对象 | 下限 | 做法 |
|---|---|---|
| 正文 | ≥ 7:1 | `--ak-fg` 压表面色：亮 16.5:1 · 暗 15:1 |
| 次要文字 | ≥ 4.5:1 | `--ak-fg-muted`：亮 6.1:1 · 暗 5.2:1 |
| 链接 | ≥ 4.5:1 | 亮色主题的链接用 `#0072A8`（5.3:1），**不用**强调蓝 `#0098DC`（压白底只有 3.2:1）；已访问链接写死算好的实色，亮 5.9:1 · 暗 5:1（见[色彩 · 链接](/foundations/color#链接)） |
| 大号 UI 文字、按钮、焦点环等非文字元素 | ≥ 3:1 | 各按钮变体两套主题下都满足；焦点环 `--ak-focus` 压白底 3.2:1 |

游戏内富文本（`.ak-rt-*`）、稀有度文字色的亮色值都是逐个加深到 AA 的版本（暗色直接用游戏原色），见[色彩 · 游戏内富文本](/foundations/color#游戏内富文本)。

## 青色只给能点的东西

青 = 链接 / 选中 / 焦点 / 主动作。卡片眉题、标题英文副标、页眉命名空间这类**不可点的装饰小标签**用 `--ak-fg-muted`——不给静态文字「可以点」的假暗示，也避开 `--ak-accent` 亮色下 3.2:1 的小字对比（见[设计理念 · DO / DON'T](/foundations/principles#do-don-t)）。

## 颜色不作唯一的信息载体

- 稀有度同时有星数；SP 回复类型同时有文字标签；增 / 减益同时有 `+` / `-` 与 ▲▼（`.ak-delta-up` / `.ak-delta-down`）。
- 选中态不只换色：实底反转 + 角标 + 字重同时变（[筛选芯片](/components/chip)、[标签页](/components/tabs)）。
- 状态靠文字说清楚：已完成的步骤有读屏文字「（已完成）」，点亮的潜能格有「（已生效）」，敌人级别把 NORMAL / ELITE / BOSS 写出来。

## 焦点

- 所有交互元素 `:focus-visible` 时 2px 青色描边（`--ak-focus`，外偏 2px，`base/root.css`；别的皮肤 / 站外由 `scope.css` 在作用域里补同一条）——鼠标点击不出环，键盘才出。不要去掉 `outline`。
- 文本类输入框例外：用 `:focus` 的青边 + 3px 淡青环（`--ak-shadow-accent`），鼠标点进去也亮；勾选 / 单选只在键盘聚焦时亮同一套（见[表单控件](/content/forms)）。
- `all: unset` 去掉原生外观的按钮（技能等级选择、参数矩阵列头、消息的关闭钮）各自补回了焦点环。

## 触控目标

≥ 36px：`.ak-btn`、`.ak-input`、裸控件默认都是 36，`--lg` 44。表格里的紧凑档 30 是唯一的例外——宽度远大于高度、外面还包着单元格内边距，而且不承担主动作（见[表单控件 · 落进表格](/content/forms#落进表格)）。`xs` / `sm` 按钮只用在密集的桌面表格里。

## 原生语义优先

折叠用 `<details>`、对话框用 `<dialog>` + `showModal()`、标签页用 `role="tablist"` + `aria-selected`、开关用 `<input type="checkbox" role="switch">`——键盘与读屏大部分由浏览器给，组件只补 WAI-ARIA 模式里缺的那几条。纯 CSS 实现无 JS 也能用（渐进增强），交互增强由皮肤脚本或 Vue 组件补上。

- 纯 CSS 提示 `[data-ak-tip]`：皮肤脚本补 `aria-describedby`（提示与元素名称相同则跳过），并给不可聚焦的元素补 `tabindex="0"`，键盘也能看到（见[文字提示 Tooltip](/components/tooltip)）。
- 只给读屏的文字用 `.ak-sr-only`（动作簇的当前项、只有图标的按钮名、SP 芯片的名称）；「跳到内容」`.ak-skip` 平时移出视口，Tab 到才出现（见[皮肤骨架 · 外壳](/chrome/#外壳)）。

## 用户偏好

| 偏好 | 处理 |
|---|---|
| `prefers-reduced-motion: reduce` | 全局把动画与过渡缩到 0.01ms、动画再加 `-.01ms` 的负延迟（`base/root.css`，别的宿主上 `scope.css` 在作用域里补；与 MW 核心 `accessibility` 特性同一写法）：动画一生成就落在终态，不是 `none`——`animationend` / `transitionend` 仍会派发，等它们的脚本不会卡住。⚠ 反过来，**动画不能当计时器用**：减弱动效下它第 0 帧就结束，`animation-play-state: paused` 也拦不住 `animationend`，靠动画播完来触发动作的脚本必须自己判断 `prefers-reduced-motion`（首页轮播曾因此每帧切一张，见[首页 · Hero 轮播](/patterns/home#hero-轮播)）；平滑滚动关掉。个别需要「不动」而不只是「很快」的地方另写了 `animation: none`（侧栏树、搜索面板、窄屏页眉），加载菱形只留中央静止的一枚，首页轮播不自动播 |
| `prefers-contrast: more` | 令牌层（`tokens.css` 末尾）把次要文字提到 `--ak-fg-secondary`、细边框换成 `--ak-border-strong`。⚠ 目前只在亮色主题生效：暗色主题的选择器特指度更高，压过这里的 `:root`（沿用原行为，未改） |
| `forced-colors: active`（Windows 高对比度等） | 见下 |

### 强制色模式

强制色下浏览器把颜色换成系统色（`Canvas` / `CanvasText` / `LinkText` / `Highlight` / `ButtonText` / `GrayText`），并抹掉 `background-color` 与 `box-shadow`——只靠「底色」或「阴影」表达的状态就看不见了。`forced-colors.css`（全部样式之后最后加载，平时一条都不生效）把这些状态改用系统色表达：

- **选中 / 当前项** = `Highlight` 底 + `HighlightText` 字（带 `forced-color-adjust: none`，否则底色照样被抹）：胶囊 / 块状标签页、按钮组与单选按钮组的选中项、筛选芯片、阶段选择器、技能等级选择、分页当前页；下划线 / 竖排页签的当前项把色条与文字换成 `Highlight`。
- **自绘控件**的填充换成系统色：勾选框 / 单选钮（裸控件与 `.ak-check` 同一张脸，含半选与禁用）、开关、滑杆、进度条（含分段）。
- **焦点**：平时用边框色 + `box-shadow` 表示焦点、`outline: 0` 的几处（勾选 / 单选、`.ak-input` / `.ak-select` / `.ak-textarea`、滑杆）补回 2px `Highlight` 描边。
- **只有底色、边框透明的块**（标签、计数徽标、幽灵按钮、Toast、消息、Cbox）补 1px 轮廓（用 `outline`，不占位、不影响排版）。
- **`clip-path` 裁出来的实心图形**（稀有度星、信赖心）改成 `CanvasText` 填充。

斜纹、网点、头图这类纯装饰在强制色下消失无妨，不处理。
