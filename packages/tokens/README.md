# @mooncellwiki/akds-tokens

AKDS（明日方舟网页设计系统，prts.wiki 皮肤）的设计令牌，≈ primer/primitives。

- `src/**/*.json5`：W3C DTCG 格式的源——`base/` 原始色板 · 字体 · 尺寸 · 动效 · 层级，`functional/` 亮 / 暗 / 高对比语义令牌与页眉头图画布主题接口，`bridge/` MediaWiki Codex 桥接
- `tokens.json`：每个令牌的 CSS 写法与亮 / 暗解析值

CSS 变量版（`tokens.css`）在仓库的 [`packages/css`](../css) 里（不发 npm，由皮肤加载）。仓库内改完源文件跑 `pnpm tokens` 重新生成。

许可：MIT。

文档：https://mooncellwiki.github.io/prts-design/foundations/color
