# @mooncellwiki/akds-tokens

AKDS（明日方舟网页设计系统，prts.wiki 皮肤）的设计令牌，≈ primer/primitives。

- `src/**/*.json5`：W3C DTCG 格式的源——`base/` 原始色板 · 字体 · 尺寸 · 动效 · 层级，`functional/` 亮 / 暗 / 高对比语义令牌与页眉头图画布主题接口，`bridge/` MediaWiki Codex 桥接
- `tokens.css`：CSS 变量版——亮 `:root` / 暗 `data-theme="dark"` · `html.skin-theme-clientpref-night` / 跟随系统 / 局部主题 `.ak-scope[data-theme]` / 高对比；只要令牌时 `import "@mooncellwiki/akds-tokens/tokens.css"`
- `tokens.json`：每个令牌的 CSS 写法与亮 / 暗解析值

`tokens.css` 与 [`packages/css`](../css)（`@mooncellwiki/akds-css`）里的 `src/tokens.css` 是同一份生成物；Codex / MediaWiki 桥接（`bridge/codex` 源）单独生成在 CSS 包的 `bridge-codex.css`，只属于皮肤、不在这份 `tokens.css` 里（`tokens.json` 里仍有它们）。仓库内改完源文件跑 `pnpm tokens` 重新生成。

许可：MIT。

文档：https://mooncellwiki.github.io/prts-design/foundations/color
