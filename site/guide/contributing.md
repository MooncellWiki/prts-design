# 贡献一个组件

一个组件由这几样东西组成，放在固定位置：

```
packages/css/src/<层>/<组件>.css       CSS 实现（唯一的样式来源）；在该层 index.css 里按顺序 @import
packages/vue/src/components/<Name>/
  Ak<Name>.vue                          Vue 实现：只输出结构 + 状态 + 可访问性，不写样式
  Ak<Name>.stories.ts                   Storybook：Playground（args）+ 每个示例一条
  demos/*.vue                           示例：Storybook 与文档站共用
site/<components|arknights>/<id>.md     文档页（或 <id>/index.md + guidelines.md + accessibility.md 三个页签）
site/.vitepress/entries/<分组>.ts        注册一条：名字、描述、CSS 文件、Vue 组件、状态、Storybook 前缀、现网模板（registry.ts 汇总）
```

## 步骤

1. **CSS**：在 `packages/css/src/components/`（通用）或 `packages/css/src/arknights/`（游戏数据）加文件，写进该层 `index.css`，然后 `node scripts/css-order.ts --write` 同步 skin.json。类名走 BEM-lite：`.ak-{block}` `__{el}` `--{mod}`，状态 `.is-{state}` / `aria-*`。
2. **Vue**：`defineProps` 的每个属性写一行 JSDoc——文档站的 Props 表直接读它。只拼类名、不写样式；需要交互的给 `v-model`，键盘与 ARIA 按 WAI-ARIA 模式补齐。
   - 命名：`label` 只用于**可访问名**（字符串，作 `aria-label`），别拿来当布尔开关；布尔 prop 用正面说法（`tip={false}` 而不是 `noTip`）。
   - 容器 + 子项的组件（标签页这类）照 Naive UI 的写法：父组件从默认插槽里读子组件的 props / 插槽自己画（`AkTabs` + `AkTabPane`），不用 provide / inject 注册——首次渲染 / SSR 预渲染就是完整的。
3. **示例**：`demos/*.vue` 每个文件一个主题（变体 / 尺寸 / 状态 …），文件名就是 Storybook 的 story 名。
4. **Stories**：`export const Variants: Story = { name: "变体", ...demo(VariantsDemo) };`——`name` 写在字面量里 Storybook 才读得到。
5. **文档**：示例用独占一行的 `@demo <Name>/<Demo>`；Vue API 用 `<PropsTable of="AkX" />`；CSS 类名一览用 `<CssClasses :files="['components/x.css']" />`（自动从样式表抽取）。正文里要写现网模板名 <code v-pre>{{Cbox2}}</code> 这类双花括号时用 `<code v-pre>`——普通行内代码挡不住 Vue 插值。
6. **注册**：在 `site/.vitepress/entries/` 对应分组的文件里加一条（`registry.ts` 汇总它们），侧栏、总览、页头都从这里来。
7. **导出**：在 `packages/vue/src/index.ts` 导出组件（与要公开的类型）；`pnpm build` 出 `@mooncellwiki/akds-vue` 的 dist。

## 改 CSS 之后

重构类改动（不应改变外观的）用样式快照比对：

```sh
node scripts/verify/styles.ts snap before   # 改之前
node scripts/verify/styles.ts snap after    # 改之后
node scripts/verify/styles.ts diff before after
```

它把预览页每个元素（含伪元素）在 亮 / 暗 / 跟随系统 / 平板 / 手机 / 活动主题 下的计算样式拍下来逐项比对。令牌由 `packages/tokens/src/` 下的 JSON5 生成：改完跑 `pnpm tokens`。
