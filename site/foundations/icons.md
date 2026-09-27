# 图标

两类图标：

- **界面线稿图标**（下面这套，24×24，`currentColor`）：页眉、动作簇、菜单、按钮里的图标。皮肤页面里是 SVG sprite `<svg><use href="#i-search"/></svg>`；Vue 里是 `<AkIcon name="search" />`，内联渲染不依赖 sprite。
- **游戏图标**（职业 / 精英 / 潜能 / 专精 / 势力 …）：torappu 解包的白色线稿 png，亮色下由 [`.ak-glyph`](/foundations/decoration#白色线稿图标-ak-glyph) 反相。

点击复制图标名。

<IconGrid />

## 界面线稿图标

- 24×24 网格、2px 描边（少数实心），颜色一律 `currentColor`，跟着文字色走；尺寸档 14 / 18 / 24 / 32 / 48（`--ak-icon-*`，见[尺寸 / 动效 / 层级](/foundations/size)）。
- 同一套路径有三处：预览骨架 `preview/_src/skeleton.html` 的 sprite（`<symbol id="i-*">`）、皮肤模板 `skin/templates/skin.mustache` 的 sprite、Vue 的 `packages/vue/src/icons.ts`；`node scripts/sprite-sync.ts` 检查三处一致（Pages 构建时也跑）。缺的图标往 sprite 里补，三处同步。
- 模板里引用：`<svg class="ak-icon"><use href="#i-search"/></svg>`（sprite 由皮肤输出在页面顶部）。现网模板用的 MDI 图标名要映射到 `i-*`，见[模板与 TemplateStyles](/guide/templates#图标)。

## 游戏图标

torappu 解包的游戏原图：职业 8（大图 / 头像小图标 / 小号三套）、分支（游戏共约 70 枚）、精英化、潜能 6、专精、稀有度星（黄 / 白 / 紧凑）、势力 logo、道具 / 技能 / 头像。白色线稿类（职业、分支、精英、势力）加 `.ak-glyph`，或由所在组件内置 `filter: var(--ak-glyph-filter)`——暗色原样、亮色反相，不用准备两套图；彩色精灵（潜能、专精、道具）不反相。

- 仓库里的示例素材在 `preview/assets/{profession,subprofession,elite,potential,specialized,rarity,camp,item,skill,avatar,…}`（只放样例页用到的那些）。
- 生产环境不打包进皮肤：用 prts.wiki `File:` 命名空间里的现网文件（模板用 <code v-pre>{{filepath:}}</code> 拼地址），或上传一套 `File:AKDS_*.png` / 放进皮肤的 `resources/images/`。令牌里的 `--ak-asset-base`（默认 `assets`）是给模板 / Gadget 拼路径预留的约定，目前没有 CSS 读取它。
- Vue 组件不内置任何游戏素材，地址一律由调用方传（生产环境是 `media.prts.wiki` 的地址）。

## 用法

```vue
<AkIcon name="search" :size="18" />                <!-- 装饰性：aria-hidden -->
<AkIcon name="warn" label="注意" />                 <!-- 有含义：role="img" + aria-label -->
<AkButton icon="more" label="更多" />               <!-- 只有图标的按钮：label 必填 -->
```
