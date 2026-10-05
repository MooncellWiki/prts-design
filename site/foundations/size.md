# 尺寸 / 动效 / 层级

## 间距

4px 栅格。

<TokenTable prefix="size.space" sample="space" />

这套阶梯在所有视口下都不变：它同时管按钮内边距、列表缩进和点按面积，手机上整档缩小会连触控区一起缩。手机上要收紧的只是版面这一层，交给语义令牌：`--ak-gutter`（两侧留白 / 栏间距，手机 16）、`--ak-header-h`（页眉高，手机 52）、`--ak-space-section`（大区块之间的竖向间隔，用于带色条的章节标题和正文 `hr`；宽屏 32，手机 24）。窄屏值见下面[布局](#布局)表的「手机」一列。

## 形状

方舟 = 直角；输入框允许 2px，是唯一的例外。色条 + 细框的盒子用 `border-image` 把色条和 1px 框直角拼接——不同宽度的 border 会被浏览器在角上斜接出一道小斜边，系统里不出现 45° 斜边。

<TokenTable prefix="size.shape" />

## 布局

断点与 Codex 一致：320 / 640 / 1120 / 1680；另有 1400 作为目录导轨的断点。侧栏与目录导轨等宽（200px），正文夹在正中；≤1400 目录导轨收起后侧栏收到 176px（覆盖写在 `:root` 上，页眉网格与布局共用）。各断点下皮肤骨架的形态见[皮肤骨架 · 响应式](/chrome/responsive)。

<TokenTable prefix="size.layout" />

## 图标尺寸 · 装饰尺寸

<TokenTable prefix="size.icon" />
<TokenTable prefix="size.decoration" />

## 动效

<TokenTable prefix="motion.duration" />
<TokenTable prefix="motion.easing" />

`prefers-reduced-motion: reduce` 下所有动画与过渡缩到 0.01ms（`base/root.css`，见[可访问性 · 用户偏好](/foundations/accessibility#用户偏好)）。

加载指示是游戏内 loading 的菱形涟漪（[加载 Spinner](/components/spinner)，菱形母题见[设计理念](/foundations/principles#菱形-源石)）；按钮的加载态只有 36px 高、涟漪放不开，退回 14px 圆弧转圈。

## 阴影

<TokenTable prefix="theme.shadow" themed />

## 层级

<TokenTable prefix="layer.z-index" />
